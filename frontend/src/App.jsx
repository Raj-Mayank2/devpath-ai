import { useEffect, useState } from "react";

import { getRoadmaps } from "./api/roadmaps";
import RoadmapCard from "./components/RoadmapCard";

import "./index.css";


function App() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadRoadmaps() {
      try {
        const data = await getRoadmaps();

        setRoadmaps(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmaps();
  }, []);


  return (
    <div className="app">

      <header className="navbar">
        <h1>DevPath AI</h1>

        <span className="badge">
          Developer Learning Platform
        </span>
      </header>


      <main className="container">

        <section className="hero">
          <span className="eyebrow">
            LEARNING ROADMAPS
          </span>

          <h2>
            Build your developer journey.
          </h2>

          <p>
            Follow structured learning paths and
            understand what to learn next.
          </p>
        </section>


        <section>

          {loading && (
            <div className="card">
              <p>Loading roadmaps...</p>
            </div>
          )}


          {error && (
            <div className="card error-card">
              <p>{error}</p>
            </div>
          )}


          {!loading &&
            !error &&
            roadmaps.length === 0 && (
              <div className="card">
                <p>No roadmaps available.</p>
              </div>
            )}


          {!loading &&
            !error &&
            roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
              />
            ))}

        </section>

      </main>

    </div>
  );
}


export default App;