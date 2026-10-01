import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Flame, Layers3, Route, Target } from "lucide-react";
import { motion } from "motion/react";

import { getDashboardStats } from "../api/dashboard";

const DONE = "#10b981";

function StatCard({ icon: Icon, label, value, description, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <strong className="mt-1 block text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </strong>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
}

function ProgressBar({ percentage, large = false, dark = false }) {
  const complete = percentage === 100;
  return (
    <div
      className={[
        "overflow-hidden rounded-full",
        dark ? "bg-white/10" : "bg-slate-100",
        large ? "h-3" : "h-2",
      ].join(" ")}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={[
          "h-full rounded-full",
          complete ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-violet-500",
        ].join(" ")}
      />
    </div>
  );
}

function ProgressRing({ percentage, size = 96, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="rgba(255,255,255,0.12)" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={percentage === 100 ? DONE : "#a5b4fc"}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - percentage / 100) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
        {percentage}%
      </span>
    </div>
  );
}

function Dashboard({ user, refreshKey, onOpenRoadmap }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");
        setStats(await getDashboardStats());
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [refreshKey]);

  if (loading && !stats) {
    return (
      <section className="py-8">
        <div className="mb-8">
          <div className="h-9 w-72 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mb-6 h-48 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </section>
    );
  }

  if (error && !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const primary = stats.roadmaps?.[0];
  const remaining = stats.total_topics - stats.completed_topics;
  const firstName = user?.name?.split(" ")[0] || "Developer";

  return (
    <section className="py-2">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          {remaining > 0
            ? `${remaining} ${remaining === 1 ? "topic" : "topics"} left across your roadmaps. Pick up where you stopped.`
            : "You've finished every topic. Nice work."}
        </p>
      </motion.div>

      {/* Current roadmap */}
      {primary && (
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200 ring-1 ring-white/10">
                <Flame size={13} />
                Continue learning
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {primary.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {primary.completed_topics} of {primary.total_topics} topics completed
              </p>

              <div className="mt-5 max-w-md">
                <ProgressBar percentage={primary.progress_percentage} dark />
              </div>

              <button
                onClick={() => onOpenRoadmap?.(primary.roadmap_id)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                Open roadmap
                <ArrowRight size={15} />
              </button>
            </div>

            <ProgressRing percentage={primary.progress_percentage} />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Route} label="Roadmaps" value={stats.total_roadmaps} description="Learning paths available" tone="bg-indigo-50 text-indigo-600" />
        <StatCard icon={Layers3} label="Total topics" value={stats.total_topics} description="Across your roadmaps" tone="bg-sky-50 text-sky-600" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed_topics} description="Topics you've finished" tone="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Target} label="Overall progress" value={`${stats.overall_progress}%`} description={`${remaining} topics remaining`} tone="bg-violet-50 text-violet-600" />
      </div>

      {/* All roadmaps */}
      <div>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Your roadmaps</h2>
          <span className="text-xs text-slate-400">
            {stats.total_roadmaps} learning path{stats.total_roadmaps !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {stats.roadmaps.map((roadmap, index) => {
            const pct = roadmap.progress_percentage;
            return (
              <motion.div
                key={roadmap.roadmap_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.05 }}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg sm:p-6"
              >
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Route size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-900">{roadmap.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {roadmap.completed_topics} of {roadmap.total_topics} topics completed
                    </p>
                  </div>
                  <span
                    className={[
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold",
                      pct === 100 ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700",
                    ].join(" ")}
                  >
                    {pct}%
                  </span>
                </div>

                <ProgressBar percentage={pct} />

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    {pct === 100 ? "Completed" : pct === 0 ? "Not started" : "In progress"}
                  </span>
                  <button
                    onClick={() => onOpenRoadmap?.(roadmap.roadmap_id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 transition group-hover:text-indigo-600"
                  >
                    {pct === 0 ? "Start" : pct === 100 ? "Review" : "Continue"}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;