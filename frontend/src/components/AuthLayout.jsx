import { motion } from "motion/react";

export const APP_NAME = "Pathforge";

/* Shared glass input styles */
export const glassInput =
  "w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-sm transition placeholder:text-slate-500 hover:border-white/20 focus:border-indigo-400/70 focus:bg-white/10 focus:ring-4 focus:ring-indigo-400/20";

export const glassLabel = "mb-1.5 block text-sm font-medium text-slate-300";

export const glassButton =
  "group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 disabled:cursor-not-allowed disabled:opacity-60";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Background glow orbs */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-indigo-600/40 blur-[110px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 30, 0], x: [0, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-32 -right-20 h-[460px] w-[460px] rounded-full bg-violet-600/35 blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]"
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Brand */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/40 ring-1 ring-white/30">
            P
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            {APP_NAME}
          </span>
        </div>

        {/* Glass card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
          {/* top edge highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          {/* soft inner sheen */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h1 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-center text-sm leading-6 text-slate-400">
              {subtitle}
            </p>

            <div className="mt-8">{children}</div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;