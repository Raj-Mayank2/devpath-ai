import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/v1";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/users/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
          <h2>Welcome to DevPath AI</h2>

          <p>
            Your personalized developer learning journey.
          </p>
        </section>

        <section className="card">
          <h2>Users</h2>

          {loading && <p>Loading users...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && users.length === 0 && (
            <p>No users found.</p>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="users">
              {users.map((user) => (
                <div className="user-card" key={user.id}>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;