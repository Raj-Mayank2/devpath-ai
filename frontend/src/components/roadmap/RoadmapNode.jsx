import { Check, ChevronRight, Circle } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

/* Both card types share one height so connectors meet at the same level. */
function RoadmapNode({ data }) {
  const { title, description, completed, hasChildren, depth, onSelect } = data;
  const isRoot = depth === 0;

  return (
    <div
      onClick={() => onSelect?.(data)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect?.(data)}
      role="button"
      tabIndex={0}
      className={[
        "group relative h-[76px] cursor-pointer outline-none",
        isRoot ? "w-[260px]" : "w-[240px]",
      ].join(" ")}
    >
      {isRoot ? (
        <div
          className={[
            "flex h-full items-center gap-3 rounded-2xl border px-4",
            "transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-xl",
            "group-focus-visible:ring-2 group-focus-visible:ring-indigo-400",
            completed
              ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-md shadow-emerald-500/10"
              : "border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg shadow-slate-900/20",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              completed
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-indigo-300 ring-1 ring-white/10",
            ].join(" ")}
          >
            {completed ? <Check size={20} strokeWidth={3} /> : <Circle size={18} />}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className={[
                "truncate text-sm font-bold",
                completed ? "text-emerald-950" : "text-white",
              ].join(" ")}
            >
              {title}
            </h3>
            <p
              className={[
                "mt-0.5 truncate text-xs",
                completed ? "text-emerald-700/70" : "text-slate-400",
              ].join(" ")}
            >
              {description || (completed ? "Completed" : "Start this path")}
            </p>
          </div>

          <ChevronRight
            size={16}
            className={[
              "shrink-0 transition-transform group-hover:translate-x-0.5",
              completed ? "text-emerald-500" : "text-slate-500",
            ].join(" ")}
          />
        </div>
      ) : (
        <div
          className={[
            "relative flex h-full items-center gap-3 overflow-hidden rounded-xl border bg-white pl-5 pr-3",
            "shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg",
            "group-focus-visible:ring-2 group-focus-visible:ring-indigo-400",
            completed
              ? "border-emerald-200 bg-emerald-50/60"
              : "border-slate-200 group-hover:border-indigo-300",
          ].join(" ")}
        >
          {/* status bar */}
          <span
            className={[
              "absolute inset-y-0 left-0 w-1.5",
              completed ? "bg-emerald-500" : "bg-slate-200 group-hover:bg-indigo-400",
            ].join(" ")}
          />

          <div
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              completed ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400",
            ].join(" ")}
          >
            {completed ? <Check size={15} strokeWidth={3} /> : <Circle size={13} />}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className={[
                "truncate text-[13px] font-semibold",
                completed ? "text-emerald-900" : "text-slate-800",
              ].join(" ")}
            >
              {title}
            </h3>
            {description && (
              <p className="mt-0.5 truncate text-[11px] text-slate-400">{description}</p>
            )}
          </div>

          <ChevronRight
            size={14}
            className="shrink-0 text-slate-300 transition group-hover:text-indigo-500"
          />
        </div>
      )}

      {/* The roadmap flows left to right, so connectors use the side handles. */}
      {depth > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2.5 !w-2.5 !border-2 !border-white !bg-slate-300"
        />
      )}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Right}
          className={[
            "!h-2.5 !w-2.5 !border-2 !border-white",
            completed ? "!bg-emerald-500" : "!bg-slate-400",
          ].join(" ")}
        />
      )}
    </div>
  );
}

export default RoadmapNode;