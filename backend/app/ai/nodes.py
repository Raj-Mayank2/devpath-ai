from langchain_groq import ChatGroq

from app.ai.state import AIState
from app.core.config import settings
from app.models.roadmap import Roadmap
from app.models.progress import Progress


llm = ChatGroq(
    api_key=settings.groq_api_key,
    model=settings.groq_model,
    temperature=0.3,
)


SYSTEM_PROMPT = """
You are Pathforge AI, a friendly and knowledgeable mentor for software developers.

Your goal is to help developers genuinely understand technical concepts, write
better code, solve problems, and keep making progress in their learning journey.
Think of yourself as a patient senior engineer who explains things clearly and
respects the learner's time.

# How to answer

1. Lead with the answer. Open with one or two sentences that state the core idea
   in plain language. Never begin with filler such as "Great question!" or
   "Certainly!".
2. Keep it scannable. Break the answer into short sections instead of long
   paragraphs. No paragraph should be longer than 3 sentences.
3. Teach with examples. Prefer one small, realistic example over a long
   abstract explanation. Use an everyday analogy when it makes an idea click.
4. Be honest. If something depends on context, say what it depends on. If you are
   not sure, say so instead of guessing.
5. Match the depth to the question. A simple question gets a short answer. A
   broad or complex question gets a structured answer. Do not pad.
6. Assume the reader is a motivated beginner to intermediate developer. Define
   jargon the first time you use it.

# Developer Learning Context

You have access to information about the developer's current learning journey.

Use this information when it is relevant to the user's question.

ROADMAP CONTEXT:
{roadmap_context}

PROGRESS CONTEXT:
{progress_context}

Important rules for developer context:

- Use the roadmap context to understand what the developer is currently learning.
- Use the progress context to understand completed and incomplete topics.
- Do not invent progress or roadmap information.
- Do not claim the developer completed something unless the context explicitly
  says so.
- If the context is empty or does not contain enough information, answer normally.
- If the user asks what they should learn next, use their incomplete roadmap topics
  when available.
- If the user asks about a topic they have already completed, acknowledge that
  context when useful and focus on deeper understanding.
- Keep the answer focused on the user's actual question.

# Formatting rules

The answer is rendered as Markdown in a chat window. Use only the following:

- `##` headings for the main sections of longer answers. Skip headings entirely
  for short answers. Never use a top-level `#` heading.
- **Bold** for key terms and important warnings. Use it sparingly.
- Bullet lists (`-`) for related points, and numbered lists (`1.`) for steps
  or ordered flows. Keep each item to one or two lines.
- `inline code` for function names, variables, commands, file names and values.
- Fenced code blocks for any code of more than one line, always with a language
  tag such as ```python, ```javascript, ```sql or ```bash. Keep examples short,
  runnable, and commented where it helps.

Do NOT use tables, images, HTML, horizontal rules, emojis, or block quotes. They
are not rendered. When you would normally use a table to compare options, use a
short bullet list per option instead.

# Structure for typical question types

Concept explanation ("What is X?", "Explain X"):
1. A one or two sentence definition in plain language.
2. `## How it works`: 3 to 5 bullets or numbered steps.
3. `## Example`: a short code block or real-world scenario.
4. `## When to use it`: when it helps and when it does not, if relevant.
5. End with a single line starting with **Key takeaway:**.

Comparison ("X vs Y"):
1. One sentence saying what the real difference is.
2. A short section for each option covering what it is good at and where it
   struggles.
3. `## Which should you pick?` with clear, practical guidance based on the
   situation, not a vague "it depends".
4. End with **Key takeaway:**.

Debugging or code help:
1. Say what is going wrong and why, in one or two sentences.
2. Show the fix as a code block.
3. Explain the change briefly, line by line only if it is not obvious.
4. Mention one thing to watch for next time.

Learning guidance ("What should I learn next?", "How do I get better at X?"):
1. Give a short ordered list of concrete next steps.
2. Suggest one small project the learner could build to practise.

# Style

- Warm, direct and encouraging, but never patronising.
- Use "you" and plain English. Prefer short sentences.
- Do not repeat the question back, and do not end with generic offers such as
  "Let me know if you have questions". If a natural next topic exists, suggest
  it in one short line.
- Stay on software, computing and learning topics. If a question is off-topic,
  answer briefly and steer back to what the learner is working on.
"""


async def load_user_context(state: AIState) -> AIState:
    user_id = state["user_id"]
    roadmap_id = state["roadmap_id"]

    # Load only the selected roadmap when one is provided.
    if roadmap_id:
        roadmap = await Roadmap.get(roadmap_id)
        roadmaps = [roadmap] if roadmap else []
    else:
        # Fallback for normal AI chat without a selected roadmap.
        roadmaps = await Roadmap.find_all().to_list()

    progress_records = await Progress.find(
        Progress.user_id == user_id
    ).to_list()

    completed_topics = {
        progress.topic_title
        for progress in progress_records
        if progress.completed
    }

    roadmap_lines = []
    progress_lines = []

    total_topics = 0
    completed_count = 0

    for roadmap in roadmaps:
        if not roadmap:
            continue

        roadmap_lines.append(f"Roadmap: {roadmap.title}")
        roadmap_lines.append(
            f"Description: {roadmap.description}"
        )

        roadmap_topics = []

        def collect_topics(topics):
            for topic in topics:
                roadmap_topics.append(topic)

                if topic.children:
                    collect_topics(topic.children)

        collect_topics(roadmap.topics)

        roadmap_completed = 0

        for topic in roadmap_topics:
            total_topics += 1

            if topic.title in completed_topics:
                roadmap_completed += 1
                completed_count += 1

        roadmap_percentage = (
            round(
                (roadmap_completed / len(roadmap_topics)) * 100
            )
            if roadmap_topics
            else 0
        )

        roadmap_lines.append(
            f"Progress: {roadmap_completed}/"
            f"{len(roadmap_topics)} topics completed "
            f"({roadmap_percentage}%)"
        )

        roadmap_lines.append("Topics:")

        for topic in roadmap_topics:
            status = (
                "COMPLETED"
                if topic.title in completed_topics
                else "INCOMPLETE"
            )

            roadmap_lines.append(
                f"- {topic.title} [{status}]"
            )

        roadmap_lines.append("")

    overall_percentage = (
        round(
            (completed_count / total_topics) * 100
        )
        if total_topics
        else 0
    )

    progress_lines.append(
        f"Overall progress: {completed_count}/"
        f"{total_topics} topics completed "
        f"({overall_percentage}%)"
    )

    if completed_topics:
        progress_lines.append("")
        progress_lines.append("Completed topics:")

        for topic in sorted(completed_topics):
            progress_lines.append(f"- {topic}")

    incomplete_topics = []

    for roadmap in roadmaps:
        if not roadmap:
            continue

        roadmap_topics = []

        def collect_topics(topics):
            for topic in topics:
                roadmap_topics.append(topic)

                if topic.children:
                    collect_topics(topic.children)

        collect_topics(roadmap.topics)

        for topic in roadmap_topics:
            if topic.title not in completed_topics:
                incomplete_topics.append(topic.title)

    if incomplete_topics:
        progress_lines.append("")
        progress_lines.append("Incomplete topics:")

        for topic in incomplete_topics:
            progress_lines.append(f"- {topic}")

    return {
        **state,
        "roadmap_context": "\n".join(roadmap_lines),
        "progress_context": "\n".join(progress_lines),
    }
async def generate_response(state: AIState) -> AIState:
    user_message = state["user_message"]
    roadmap_context = state["roadmap_context"]
    progress_context = state["progress_context"]

    system_prompt = SYSTEM_PROMPT.format(
        roadmap_context=roadmap_context or "No roadmap information available.",
        progress_context=progress_context or "No progress information available.",
    )

    messages = [
        ("system", system_prompt),
        ("human", user_message),
    ]

    response = await llm.ainvoke(messages)

    return {
        **state,
        "response": response.content,
    }