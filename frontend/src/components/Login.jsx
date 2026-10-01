import { useState } from "react";
import {
  loginUser,
  getCurrentUser,
} from "../api/auth";


function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginUser(email, password);

      const user = await getCurrentUser();

      onLogin(user);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue your learning journey.
        </p>


        <form onSubmit={handleSubmit}>

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="••••••••"
            required
          />


          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="auth-switch">

          Don't have an account?

          <button
            type="button"
            onClick={onSwitchToRegister}
          >
            Register
          </button>

        </p>

      </div>

    </div>
  );
}


export default Login;