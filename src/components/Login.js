import { useState } from "react";
import { login } from "../redux/apiCalls";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Auth.css";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isFetching, error } = useSelector((state) => state.user);
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const success = await login(dispatch, { email, password });
      if (success) history.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative blobs */}
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />

      <div className="auth-card fade-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">⌨</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your PasteBin account</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleClick}>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Email address</label>
            <div className="input-with-icon">
              <span className="input-icon">✉</span>
              <input
                id="login-email"
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
            <label className="input-label" htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                type="password"
                className="input-modern"
                placeholder="••••••••"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="alert-error">
              {typeof error === "string" ? error : "Invalid credentials. Please try again."}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={isFetching}
          >
            {isFetching ? (
              <span className="btn-loading">
                <span className="spinner" /> Signing in…
              </span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register" className="auth-link">Create one free</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
