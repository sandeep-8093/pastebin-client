import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { register } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import "./Auth.css";

const Register = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.user);
  const history = useHistory();

  // Password strength helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8)              score++;
    if (/[A-Z]/.test(pwd))            score++;
    if (/[0-9]/.test(pwd))            score++;
    if (/[^A-Za-z0-9]/.test(pwd))     score++;
    if (score <= 1) return { level: score, label: "Weak",   color: "#ef4444" };
    if (score === 2) return { level: score, label: "Fair",   color: "#f59e0b" };
    if (score === 3) return { level: score, label: "Good",   color: "#3b82f6" };
    return              { level: score, label: "Strong", color: "#10b981" };
  };

  const strength = getPasswordStrength(password);

  const handleClick = async (e) => {
    e.preventDefault();
    const success = await register(dispatch, { email, password, username });
    if (success) history.push("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />

      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="auth-logo">⌨</div>
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Join PasteBin — it's completely free</p>
        </div>

        <form className="auth-form" onSubmit={handleClick}>
          <div className="input-group">
            <label className="input-label" htmlFor="reg-username">Username</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="reg-username"
                type="text"
                className="input-modern"
                placeholder="your_username"
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-email">Email address</label>
            <div className="input-with-icon">
              <span className="input-icon">✉</span>
              <input
                id="reg-email"
                type="email"
                className="input-modern"
                placeholder="you@example.com"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-password">Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="reg-password"
                type="password"
                className="input-modern"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Password strength bar */}
            {password && (
              <div className="pwd-strength">
                <div className="pwd-bars">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="pwd-bar"
                      style={{
                        background: n <= strength.level ? strength.color : "var(--border-subtle)",
                        transition: "background 0.3s ease",
                      }}
                    />
                  ))}
                </div>
                <span className="pwd-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="alert-error">
              {error === true ? "Something went wrong. Please try again." : error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={isFetching}
          >
            {isFetching ? (
              <span className="btn-loading">
                <span className="spinner" /> Creating account…
              </span>
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
