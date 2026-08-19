import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;

    // TODO: connect with backend password reset
    setSent(true);
  };

  return (
    <div className="auth-screen">
      <div className="auth-ambient" aria-hidden="true" />

      <form className="auth-card" onSubmit={submit}>
        <img src="/pathpilot-logo.png" alt="PathPilot" className="auth-logo" />

        <div className="eyebrow">ACCOUNT RECOVERY</div>
        <h1>Reset your password</h1>
        <p className="auth-muted">Enter your email and we'll send recovery instructions.</p>

        {sent ? (
          <div className="auth-success">Check {email} for a reset link.</div>
        ) : (
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
        )}

        <button className="primary-button wide" type="submit" disabled={sent}>
          {sent ? "Link sent ✓" : "Send reset link"}
        </button>

        <p className="auth-footer">
          <Link to="/login">← Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}