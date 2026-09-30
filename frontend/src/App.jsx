import { useEffect, useState } from "react";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/health")
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus("Backend unavailable");
      });
  }, []);

  return (
    <div>
      <h1>DevPath AI</h1>

      <p>
        AI-powered developer learning platform
      </p>

      <p>
        Backend status: <strong>{backendStatus}</strong>
      </p>
    </div>
  );
}

export default App;