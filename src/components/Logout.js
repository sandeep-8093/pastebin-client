import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../redux/apiCalls";
import "./Logout.css";

const Logout = () => {
  const history  = useHistory();
  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    window.localStorage.clear();
    logout(dispatch);
    history.push("/login");
  };

  return (
    <div className="logout-page">
      <div className="auth-blob blob-1" />
      <div className="auth-blob blob-2" />

      <div className="logout-card fade-in">
        <div className="logout-icon-wrap">
          <span className="logout-icon">👋</span>
        </div>
        <h1 className="logout-title">Sign Out</h1>
        <p className="logout-msg">
          You're about to sign out of PasteBin.<br />
          Come back soon — we'll miss you!
        </p>

        <div className="logout-actions">
          <button className="btn-primary logout-btn" onClick={handleLogout}>
            Yes, Sign Me Out
          </button>
          <Link to="/" className="btn-secondary logout-cancel">
            Stay Signed In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Logout;
