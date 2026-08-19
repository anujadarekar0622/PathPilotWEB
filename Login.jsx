import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Enter your username and password to continue.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Invalid username or password.");

      // save jwt tokens
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      navigate("/home");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-ambient" aria-hidden="true" />

      <form className="auth-card" onSubmit={submit}>
        <img src="/pathpilot-logo.png" alt="PathPilot" className="auth-logo" />

        <div className="eyebrow">WELCOME BACK</div>
        <h1>Sign in to PathPilot</h1>
        <p className="auth-muted">Continue your learning journey.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="testuser"
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <div className="form-row-right">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button className="primary-button wide" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="auth-footer">
          New to PathPilot? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
}