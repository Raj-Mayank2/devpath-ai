import { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Route,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function Navbar({ user, activePage = "dashboard", onNavigate, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "roadmaps",
      label: "Roadmaps",
      icon: Route,
    },
  ];

  function handleNavigation(page) {
    setMobileOpen(false);

    if (onNavigate) {
      onNavigate(page);
    }
  }

  function handleLogout() {
    setMobileOpen(false);

    if (onLogout) {
      onLogout();
    }
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <button
            onClick={() => handleNavigation("dashboard")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm transition-transform group-hover:scale-105">
              <BookOpen size={18} strokeWidth={2.2} />
            </div>

            <div className="text-left">
              <div className="text-[15px] font-bold tracking-tight text-slate-950">
                DevPath
                <span className="text-blue-600"> AI</span>
              </div>

              <div className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                Learn. Build. Grow.
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={[
                    "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop User */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="h-7 w-px bg-slate-200" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                {initials}
              </div>

              <div className="hidden lg:block">
                <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">
                  {user?.name || "Developer"}
                </p>
                <p className="max-w-[150px] truncate text-xs text-slate-400">
                  {user?.email || ""}
                </p>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-1 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((previous) => !previous)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-16 z-40 overflow-hidden border-b border-slate-200 bg-white shadow-lg md:hidden"
          >
            <div className="space-y-1 p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                      active
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-500 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}

              <div className="my-3 border-t border-slate-100" />

              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={17} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;