import { useEffect, useState } from "react";

import RoadmapCanvas from "./components/roadmap/RoadmapCanvas";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/layout/Navbar";

import { getCurrentUser, logoutUser } from "./api/auth";
import { getRoadmaps } from "./api/roadmaps";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState("");
  const [progressVersion, setProgressVersion] = useState(0);
  const [activePage, setActivePage] = useState("dashboard");

  /* Load current user */
  useEffect(() => {
    async function loadUser() {
      try {
        setUser(await getCurrentUser());
      } catch (error) {
        console.error("Failed to load current user:", error);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  /* Load roadmaps */
  useEffect(() => {
    if (!user) return;

    async function loadRoadmaps() {
      try {
        setLoadingRoadmaps(true);
        setRoadmaps(await getRoadmaps());
      } catch (error) {
        console.error("Failed to load roadmaps:", error);
      } finally {
        setLoadingRoadmaps(false);
      }
    }
    loadRoadmaps();
  }, [user]);

  /* Select first roadmap */
  useEffect(() => {
    if (roadmaps.length > 0 && !selectedRoadmapId) {
      setSelectedRoadmapId(roadmaps[0].id);
    }
  }, [roadmaps, selectedRoadmapId]);

  function handleLogin(currentUser) {
    setUser(currentUser);
    setActivePage("dashboard");
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setRoadmaps([]);
    setSelectedRoadmapId("");
    setShowRegister(false);
    setActivePage("dashboard");
  }

  function handleNavigation(page) {
    setActivePage(page);
    window.scrollTo({ top: 0 });
  }

  function handleProgressChange() {
    setProgressVersion((previous) => previous + 1);
  }

  /* Open a roadmap from the dashboard */
  function handleOpenRoadmap(roadmapId) {
    const match = roadmaps.find((r) => String(r.id) === String(roadmapId));
    if (match) setSelectedRoadmapId(match.id);
    handleNavigation("roadmaps");
  }

  /* Initial loading */
  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 text-base font-bold text-white shadow-lg shadow-indigo-900/20">
            D
          </div>
          <p className="text-sm font-medium text-slate-500">Loading DevPath AI...</p>
        </div>
      </div>
    );
  }

  /* Authentication */
  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleLogin}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  const selectedRoadmap = roadmaps.find(
    (roadmap) => String(roadmap.id) === String(selectedRoadmapId)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-[#f7f8fa] to-white text-slate-900">
      <Navbar
        user={user}
        activePage={activePage}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard */}
        {activePage === "dashboard" && (
          <Dashboard
            user={user}
            refreshKey={progressVersion}
            onOpenRoadmap={handleOpenRoadmap}
          />
        )}

        {/* Roadmaps */}
        {activePage === "roadmaps" && (
          <section>
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Your roadmaps
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Select a topic to read about it, then mark it complete to track your progress.
                </p>
              </div>

              {/* Roadmap picker */}
              {roadmaps.length > 0 && (
                <div className="w-full lg:w-[320px]">
                  <label
                    htmlFor="roadmap-select"
                    className="mb-1.5 block text-xs font-semibold text-slate-500"
                  >
                    Learning path
                  </label>
                  <select
                    id="roadmap-select"
                    value={selectedRoadmapId}
                    onChange={(event) => setSelectedRoadmapId(event.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    {roadmaps.map((roadmap) => (
                      <option key={roadmap.id} value={roadmap.id}>
                        {roadmap.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {loadingRoadmaps ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                  <p className="text-sm font-medium text-slate-500">Loading roadmaps...</p>
                </div>
              </div>
            ) : roadmaps.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <h2 className="text-lg font-semibold text-slate-900">No roadmaps yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Your learning paths will show up here as soon as one is added.
                </p>
              </div>
            ) : (
              selectedRoadmap && (
                <RoadmapCanvas
                  key={selectedRoadmap.id}
                  roadmap={selectedRoadmap}
                  onProgressChange={handleProgressChange}
                />
              )
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;