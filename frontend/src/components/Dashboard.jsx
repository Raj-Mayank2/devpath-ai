import { useEffect, useState } from "react";

import { getDashboardStats } from "../api/dashboard";


function Dashboard({ user, refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStats();

        setStats(data);

      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        setError(
          "Failed to load dashboard statistics."
        );

      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [refreshKey]);


  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }


  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }


  return (
    <section className="dashboard">

      {/* Dashboard Heading */}

      <div className="dashboard-heading">

        <div>

          <p className="dashboard-label">
            Your Learning Dashboard
          </p>

          <h2>
            Welcome back, {user.name} 👋
          </h2>

          <p>
            Keep building your developer skills
            one step at a time.
          </p>

        </div>

      </div>


      {/* Overall Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <span className="stat-label">
            Roadmaps
          </span>

          <strong>
            {stats.total_roadmaps}
          </strong>

        </div>


        <div className="stat-card">

          <span className="stat-label">
            Total Topics
          </span>

          <strong>
            {stats.total_topics}
          </strong>

        </div>


        <div className="stat-card">

          <span className="stat-label">
            Completed
          </span>

          <strong>
            {stats.completed_topics}
          </strong>

        </div>


        <div className="stat-card">

          <span className="stat-label">
            Overall Progress
          </span>

          <strong>
            {stats.overall_progress}%
          </strong>

        </div>

      </div>


      {/* Overall Progress */}

      <div className="overall-progress-card">

        <div className="progress-card-header">

          <div>

            <h3>
              Overall Learning Progress
            </h3>

            <p>
              {stats.completed_topics} of{" "}
              {stats.total_topics} topics completed
            </p>

          </div>

          <strong>
            {stats.overall_progress}%
          </strong>

        </div>


        <div className="dashboard-progress-bar">

          <div
            className="dashboard-progress-fill"
            style={{
              width:
                `${stats.overall_progress}%`,
            }}
          />

        </div>

      </div>


      {/* Per Roadmap Progress */}

      <div className="roadmap-progress-section">

        <div className="section-heading">

          <h3>
            Your Roadmaps
          </h3>

          <p>
            Track your progress across each learning path.
          </p>

        </div>


        <div className="roadmap-progress-list">

          {stats.roadmaps.map((roadmap) => (

            <div
              key={roadmap.roadmap_id}
              className="roadmap-progress-card"
            >

              <div className="roadmap-progress-header">

                <div>

                  <h4>
                    {roadmap.title}
                  </h4>

                  <p>
                    {roadmap.completed_topics} of{" "}
                    {roadmap.total_topics} topics completed
                  </p>

                </div>

                <strong>
                  {roadmap.progress_percentage}%
                </strong>

              </div>


              <div className="dashboard-progress-bar">

                <div
                  className="dashboard-progress-fill"
                  style={{
                    width:
                      `${roadmap.progress_percentage}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}


export default Dashboard;