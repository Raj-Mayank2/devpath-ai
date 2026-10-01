import {
  BookOpen,
  Check,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Loader2,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { getResourcesByTopic } from "../../api/resources";

/* Resource icon + colour by type */
function resourceStyle(type) {
  const value = type?.toLowerCase() || "";

  if (value.includes("video")) {
    return { icon: Video, tone: "bg-rose-50 text-rose-600 group-hover:bg-rose-100" };
  }
  if (value.includes("article") || value.includes("documentation")) {
    return { icon: FileText, tone: "bg-sky-50 text-sky-600 group-hover:bg-sky-100" };
  }
  return { icon: LinkIcon, tone: "bg-violet-50 text-violet-600 group-hover:bg-violet-100" };
}

function TopicPanel({ topic, updating, onClose, onToggle }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* Load resources */
  useEffect(() => {
    async function loadResources() {
      try {
        setLoading(true);
        setError("");
        setResources(await getResourcesByTopic(topic.title));
      } catch (err) {
        console.error("Failed to load resources:", err);
        setError("Couldn't load resources. Select the topic again to retry.");
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, [topic.title]);

  /* Close with Escape */
  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[1px] sm:hidden"
      />

      {/* Fixed to the viewport so it stays visible however far the roadmap is scrolled */}
      <motion.aside
        role="dialog"
        aria-label={`${topic.title} details`}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-3 bottom-3 top-20 z-40 flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/15 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[400px]"
      >
        {/* Header */}
        <div
          className={[
            "relative shrink-0 px-6 pb-5 pt-5",
            topic.completed
              ? "bg-gradient-to-br from-emerald-50 to-white"
              : "bg-gradient-to-br from-indigo-50 to-white",
          ].join(" ")}
        >
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
          >
            <X size={18} />
          </button>

          {topic.completed ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
              <Check size={12} strokeWidth={3} />
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              Not completed
            </span>
          )}

          <h2 className="mt-3 pr-8 text-xl font-bold leading-snug tracking-tight text-slate-900">
            {topic.title}
          </h2>

          {topic.description && (
            <p className="mt-2 text-sm leading-6 text-slate-600">{topic.description}</p>
          )}
        </div>

        {/* Resources */}
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-slate-100 px-6 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Learning resources</h3>
            {!loading && !error && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                {resources.length}
              </span>
            )}
          </div>

          {loading && (
            <div className="space-y-2.5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-[72px] animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && resources.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <BookOpen size={22} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">No resources yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Search this topic's name to start, then mark it complete when you're done.
              </p>
            </div>
          )}

          {!loading && !error && resources.length > 0 && (
            <ul className="space-y-2.5">
              {resources.map((resource) => {
                const { icon: Icon, tone } = resourceStyle(resource.resource_type);
                return (
                  <li key={resource.id}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${tone}`}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-[13px] font-semibold leading-5 text-slate-800 group-hover:text-indigo-700">
                            {resource.title}
                          </h4>
                          <ExternalLink
                            size={14}
                            className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-indigo-500"
                          />
                        </div>

                        {resource.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500">
                            {resource.description}
                          </p>
                        )}

                        {resource.resource_type && (
                          <span className="mt-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-500">
                            {resource.resource_type}
                          </span>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <button
            onClick={onToggle}
            disabled={updating}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400",
              topic.completed
                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
              updating ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
          >
            {updating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : topic.completed ? (
              "Mark as incomplete"
            ) : (
              <>
                <Check size={16} strokeWidth={3} />
                Mark as complete
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default TopicPanel;