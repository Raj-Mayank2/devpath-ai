import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

import AuthLayout, {
  glassButton,
  glassInput,
  glassLabel,
} from "./AuthLayout";
import { registerUser, loginUser, getCurrentUser } from "../api/auth";

const iconClass =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500";

function Register({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDiffer = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Create account
      await registerUser(name, email, password);

      // Login immediately after registration
      await loginUser(email, password);

      // Get authenticated user
      const user = await getCurrentUser();

      onRegister(user);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your developer learning journey."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-indigo-300 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
          >
            Log in
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="register-name" className={glassLabel}>
            Name
          </label>
          <div className="relative">
            <User size={17} className={iconClass} />
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              className={glassInput}
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className={glassLabel}>
            Email
          </label>
          <div className="relative">
            <Mail size={17} className={iconClass} />
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className={glassInput}
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className={glassLabel}>
            Password
          </label>
          <div className="relative">
            <Lock size={17} className={iconClass} />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              className={`${glassInput} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="register-confirm" className={glassLabel}>
            Confirm password
          </label>
          <div className="relative">
            <Lock size={17} className={iconClass} />
            <input
              id="register-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              required
              className={[
                glassInput,
                passwordsDiffer
                  ? "!border-red-400/50 focus:!border-red-400/70 focus:!ring-red-400/20"
                  : "",
                passwordsMatch
                  ? "!border-emerald-400/50 focus:!border-emerald-400/70 focus:!ring-emerald-400/20"
                  : "",
              ].join(" ")}
            />
          </div>

          {passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <CheckCircle2 size={13} />
              Passwords match
            </p>
          )}
          {passwordsDiffer && (
            <p className="mt-1.5 text-xs font-medium text-red-300">
              Passwords don't match yet
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className={glassButton}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;