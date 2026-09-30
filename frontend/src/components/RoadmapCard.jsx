import { useEffect, useState } from "react";

import {
  getProgress,
  toggleProgress,
} from "../api/progress";


function TopicItem({
  topic,
  roadmapId,
  completedTopics,
  onProgressChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const hasChildren =
    topic.children && topic.children.length > 0;

  const isCompleted = completedTopics.has(topic.title);


  async function handleToggle() {
    if (updating) {
      return;
    }

    try {
      setUpdating(true);

      const result = await toggleProgress(
        "demo-user",
        roadmapId,
        topic.title
      );

      onProgressChange(result);
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setUpdating(false);
    }
  }


  return (
    <div className="topic">

      <div className="topic-header">

        <div
          className="topic-info"
          onClick={() =>
            hasChildren && setExpanded(!expanded)
          }
        >

          {hasChildren && (
            <span className="topic-toggle">
              {expanded ? "−" : "+"}
            </span>
          )}

          <div>

            <h4
              className={
                isCompleted
                  ? "completed-topic"
                  : ""
              }
            >
              {topic.title}
            </h4>

            {topic.description && (
              <p>{topic.description}</p>
            )}

          </div>

        </div>


        <button
          className={`progress-button ${
            isCompleted ? "completed" : ""
          }`}
          onClick={handleToggle}
          disabled={updating}
        >
          {updating
            ? "..."
            : isCompleted
            ? "✓ Completed"
            : "Mark Complete"}
        </button>

      </div>


      {expanded && hasChildren && (
        <div className="topic-children">

          {topic.children
            .sort((a, b) => a.order - b.order)
            .map((child) => (
              <TopicItem
                key={`${topic.title}-${child.title}`}
                topic={child}
                roadmapId={roadmapId}
                completedTopics={completedTopics}
                onProgressChange={onProgressChange}
              />
            ))}

        </div>
      )}

    </div>
  );
}


function RoadmapCard({ roadmap }) {

  const [completedTopics, setCompletedTopics] =
    useState(new Set());


  /*
   * Load saved progress from backend
   * whenever the roadmap is loaded.
   */
  useEffect(() => {

    async function loadProgress() {

      try {

        const progress = await getProgress(
          "demo-user",
          roadmap.id
        );

        const completed = new Set(
          progress
            .filter((item) => item.completed)
            .map((item) => item.topic_title)
        );

        setCompletedTopics(completed);

      } catch (error) {

        console.error(
          "Failed to load progress:",
          error
        );

      }

    }

    loadProgress();

  }, [roadmap.id]);


  /*
   * Update local React state after
   * progress is changed in the backend.
   */
  function handleProgressChange(progress) {

    setCompletedTopics((previous) => {

      const updated = new Set(previous);

      if (progress.completed) {

        updated.add(progress.topic_title);

      } else {

        updated.delete(progress.topic_title);

      }

      return updated;

    });

  }


  /*
   * Count every topic including
   * nested child topics.
   */
  const totalTopics =
    countTopics(roadmap.topics);


  const completedCount =
    completedTopics.size;


  const progressPercentage =
    totalTopics === 0
      ? 0
      : Math.round(
          (completedCount / totalTopics) * 100
        );


  return (
    <section className="roadmap-card">

      {/* Roadmap Header */}

      <div className="roadmap-header">

        <div>

          <h2>
            {roadmap.title}
          </h2>

          <p>
            {roadmap.description}
          </p>

        </div>


        <span className="topic-count">
          {totalTopics} topics
        </span>

      </div>


      {/* Progress */}

      <div className="progress-section">

        <div className="progress-info">

          <span>
            Learning Progress
          </span>

          <strong>
            {completedCount} / {totalTopics}
          </strong>

        </div>


        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          />

        </div>


        <span className="progress-percentage">
          {progressPercentage}% complete
        </span>

      </div>


      {/* Topics */}

      <div className="roadmap-topics">

        {roadmap.topics
          .sort((a, b) => a.order - b.order)
          .map((topic) => (

            <TopicItem
              key={topic.title}
              topic={topic}
              roadmapId={roadmap.id}
              completedTopics={completedTopics}
              onProgressChange={
                handleProgressChange
              }
            />

          ))}

      </div>

    </section>
  );
}


/*
 * Recursively count topics and
 * nested child topics.
 */
function countTopics(topics) {

  let count = 0;

  for (const topic of topics) {

    // Count current topic
    count += 1;

    // Count child topics
    if (topic.children?.length) {

      count += countTopics(
        topic.children
      );

    }

  }

  return count;
}


export default RoadmapCard;