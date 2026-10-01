import { useEffect, useState } from "react";

import RoadmapCard from "./components/RoadmapCard";
import Login from "./components/Login";

import {
  getCurrentUser,
  logoutUser,
} from "./api/auth";

import {
  getRoadmaps,
} from "./api/roadmaps";

import Register from "./components/Register";


function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(false);


  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Failed to load current user:",
          error
        );
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);


  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadRoadmaps() {
      try {
        setLoadingRoadmaps(true);

        const data = await getRoadmaps();

        setRoadmaps(data);
      } catch (error) {
        console.error(
          "Failed to load roadmaps:",
          error
        );
      } finally {
        setLoadingRoadmaps(false);
      }
    }

    loadRoadmaps();
  }, [user]);


  function handleLogin(currentUser) {
    setUser(currentUser);
  }


  function handleLogout() {
  logoutUser();

  setUser(null);
  setRoadmaps([]);
  setShowRegister(false);
}


  if (loadingUser) {
    return (
      <div className="loading-page">
        <p>Loading DevPath AI...</p>
      </div>
    );
  }


  if (!user) {

  if (showRegister) {
    return (
      <Register
        onRegister={handleLogin}
        onSwitchToLogin={() =>
          setShowRegister(false)
        }
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() =>
        setShowRegister(true)
      }
    />
  );
}

  return (
    <div className="app">

      <header className="app-header">

        <div>
          <h1>DevPath AI</h1>

          <p>
            Your AI-powered developer learning path.
          </p>
        </div>


        <div className="user-section">

          <span>
            Hi, {user.name} 👋
          </span>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </header>


      <main className="app-content">

        <div className="page-heading">

          <h2>
            Your Learning Roadmap
          </h2>

          <p>
            Learn step by step and track your progress.
          </p>

        </div>


        {loadingRoadmaps ? (

          <p>
            Loading roadmaps...
          </p>

        ) : roadmaps.length === 0 ? (

          <p>
            No roadmaps available.
          </p>

        ) : (

          roadmaps.map((roadmap) => (

            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
            />

          ))

        )}

      </main>

    </div>
  );
}


export default App;