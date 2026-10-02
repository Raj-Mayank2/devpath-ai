import {
  AlertCircle,
  Bot,
  Check,
  Code2,
  Copy,
  Database,
  KeyRound,
  Layers,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { sendAIMessage } from "../api/ai";

const SUGGESTIONS = [
  { icon: Layers, title: "Explain REST APIs", hint: "Core ideas, with an example" },
  { icon: Code2, title: "What is dependency injection?", hint: "Why it matters in real code" },
  { icon: Database, title: "MongoDB vs PostgreSQL", hint: "When to pick which" },
  { icon: KeyRound, title: "How does JWT authentication work?", hint: "Step by step flow" },
];

/* =========================================
   Copy-to-clipboard hook
========================================= */
function useCopy() {
  const [copied, setCopied] = useState(false);

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return [copied, copy];
}

/* =========================================
   Lightweight markdown renderer
   (no dependencies, no raw HTML)
========================================= */
function renderInline(text) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={i}
          className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-indigo-700"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function CodeBlock({ language, code }) {
  const [copied, copy] = useCopy();

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">{language || "code"}</span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-6 text-slate-200">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function renderTextBlock(text, keyBase) {
  const out = [];
  let paragraph = [];
  let list = null; // { ordered, items }

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(
        <p key={`${keyBase}-p-${out.length}`} className="my-2 first:mt-0 last:mb-0">
          {renderInline(paragraph.join(" "))}
        </p>
      );
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list) {
      const Tag = list.ordered ? "ol" : "ul";
      out.push(
        <Tag
          key={`${keyBase}-l-${out.length}`}
          className={`my-2 space-y-1 pl-5 ${list.ordered ? "list-decimal" : "list-disc"} marker:text-slate-400`}
        >
          {list.items.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </Tag>
      );
      list = null;
    }
  };

  text.split("\n").forEach((raw) => {
    const line = raw.trimEnd();
    const heading = line.match(/^(#{1,4})\s+(.*)/);
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      out.push(
        <h4
          key={`${keyBase}-h-${out.length}`}
          className="mb-1 mt-4 text-[15px] font-bold text-slate-900 first:mt-0"
        >
          {renderInline(heading[2])}
        </h4>
      );
    } else if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet || numbered)[1]);
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  });

  flushParagraph();
  flushList();
  return out;
}

function Markdown({ content }) {
  const blocks = [];
  const fence = /```([\w+-]*)\n?([\s\S]*?)```/g;
  let last = 0;
  let match;

  while ((match = fence.exec(content)) !== null) {
    if (match.index > last) {
      blocks.push(...renderTextBlock(content.slice(last, match.index), `t${last}`));
    }
    blocks.push(
      <CodeBlock key={`c${match.index}`} language={match[1]} code={match[2].replace(/\n$/, "")} />
    );
    last = fence.lastIndex;
  }
  if (last < content.length) {
    blocks.push(...renderTextBlock(content.slice(last), `t${last}`));
  }

  return <div className="text-sm leading-7 text-slate-700">{blocks}</div>;
}

/* =========================================
   Message bubble
========================================= */
function Message({ item }) {
  const isUser = item.role === "user";
  const [copied, copy] = useCopy();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
          <Bot size={17} />
        </div>
      )}

      <div className={`min-w-0 ${isUser ? "max-w-[85%] sm:max-w-[75%]" : "max-w-full flex-1 sm:max-w-[85%] sm:flex-none"}`}>
        {isUser ? (
          <div className="rounded-2xl rounded-br-md bg-gradient-to-br from-slate-900 to-indigo-950 px-4 py-3 text-sm leading-6 text-white shadow-md shadow-slate-900/10">
            <p className="whitespace-pre-wrap break-words">{item.content}</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <Markdown content={item.content} />
            </div>
            <button
              type="button"
              onClick={() => copy(item.content)}
              className="mt-1.5 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy answer"}
            </button>
          </>
        )}
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
          <User size={17} />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
        <Bot size={17} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-indigo-400"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        <span className="ml-2 text-xs text-slate-400">Thinking...</span>
      </div>
    </div>
  );
}

/* =========================================
   AI Mentor
========================================= */
function AIMentor() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedMessage, setFailedMessage] = useState("");

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  /* Keep the newest message in view */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, error]);

  /* Auto-grow the textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [message]);

  async function send(text, { addUser = true } = {}) {
    setError("");
    setFailedMessage("");

    if (addUser) {
      setMessages((previous) => [...previous, { role: "user", content: text }]);
    }
    setLoading(true);

    try {
      const data = await sendAIMessage(text);
      setMessages((previous) => [...previous, { role: "assistant", content: data.response }]);
    } catch (err) {
      console.error("AI request failed:", err);
      setError(err.message || "Something went wrong.");
      setFailedMessage(text);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setMessage("");
    send(trimmed);
  }

  function clearChat() {
    setMessages([]);
    setError("");
    setFailedMessage("");
  }

  function pickSuggestion(text) {
    setMessage(text);
    textareaRef.current?.focus();
  }

  return (
    <section className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            <Sparkles size={14} />
            AI Mentor
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Learn with your AI mentor
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Ask about programming, system design, databases, AI, or anything you're
            learning right now.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:self-auto"
          >
            <Trash2 size={14} />
            Clear chat
          </button>
        )}
      </div>

      {/* Chat */}
      <div className="flex h-[calc(100vh-16rem)] min-h-[540px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-6 overflow-y-auto bg-gradient-to-b from-slate-50/80 to-white p-5 sm:p-7"
        >
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center py-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/30">
                <Bot size={30} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">What do you want to learn?</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Ask me to explain a concept, compare technologies, walk through code, or
                plan what to learn next.
              </p>

              <div className="mt-8 grid w-full max-w-xl gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map(({ icon: Icon, title, hint }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => pickSuggestion(title)}
                    className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((item, index) => (
              <Message key={`${item.role}-${index}`} item={item} />
            ))
          )}

          {loading && <TypingIndicator />}

          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle size={17} className="shrink-0" />
              <span className="min-w-0 flex-1">{error}</span>
              {failedMessage && (
                <button
                  type="button"
                  onClick={() => send(failedMessage, { addUser: false })}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-100"
                >
                  <RotateCcw size={13} />
                  Try again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-4 sm:p-5">
          <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask your AI mentor..."
              rows={1}
              className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              aria-label="Send message"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>

          <p className="mt-2 px-1 text-[11px] text-slate-400">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </div>
    </section>
  );
}

export default AIMentor;