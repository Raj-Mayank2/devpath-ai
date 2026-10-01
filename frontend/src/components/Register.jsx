import { useState } from "react";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../api/auth";


function Register({
  onRegister,
  onSwitchToLogin,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      // Create account
      await registerUser(
        name,
        email,
        password
      );

      // Login immediately after registration
      await loginUser(
        email,
        password
      );

      // Get authenticated user
      const user = await getCurrentUser();

      onRegister(user);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start your developer learning journey.
        </p>


        <form onSubmit={handleSubmit}>

          <label>
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Your name"
            required
          />


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


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
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
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        <p className="auth-switch">

          Already have an account?

          <button
            type="button"
            onClick={onSwitchToLogin}
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}


export default Register;