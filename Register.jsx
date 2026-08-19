import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Fill in every field to create your account.");
      return;
    }

    setError("");

    // TODO: connect with backend registration
    navigate("/home");
  };

  return (
    <div className="auth-screen">
      <div className="auth-ambient" aria-hidden="true" />

      <form className="auth-card" onSubmit={submit}>
        <img src="/pathpilot-logo.png" alt="PathPilot" className="auth-logo" />

        <div className="eyebrow">GET STARTED</div>
        <h1>Create your account</h1>
        <p className="auth-muted">Set up your personal PathPilot workspace.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </label>

        <button className="primary-button wide" type="submit">
          Create account
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}