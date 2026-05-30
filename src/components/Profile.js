import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { userRequest } from "../requestMethods";
import "./NewPaste.css"; // Reuse modern styles & custom scrollbars

export default function Profile() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userProfile, setUserProfile] = useState(null);
  const [pastes, setPastes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (!currentUser) {
      history.push("/login");
      return;
    }

    // Fetch user profile from /auth/me and then their pastes
    const fetchData = async () => {
      try {
        const profileRes = await userRequest.get("auth/me");
        setUserProfile(profileRes.data);

        const pastesRes = await userRequest.get("paste/getall");
        setPastes(pastesRes.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, history]);

  const handleDelete = (idx) => {
    if (window.confirm("Are you sure you want to delete this paste?")) {
      userRequest
        .delete(`paste/delete/${idx}`)
        .then(() => {
          setPastes((prev) => prev.filter((p) => p.idx !== idx));
        })
        .catch((err) => console.error("Error deleting paste:", err));
    }
  };

  const handleEdit = (idx) => {
    history.push(`/paste/edit/${idx}`);
  };

  if (loading) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon" style={{ animation: "pulse 1.5s ease infinite" }}>◎</div>
        <div className="empty-title">Loading profile…</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">⚠️</div>
        <div className="empty-title">Failed to load profile</div>
        <div className="empty-subtitle">Please log in again.</div>
      </div>
    );
  }

  // Filter pastes based on search term
  const filteredPastes = pastes.filter((paste) =>
    (paste.title || "Untitled Paste")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const initial = userProfile.username ? userProfile.username[0].toUpperCase() : "U";

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
      {/* Profile Card Hero */}
      <div className="show-paste-hero" style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)", flexWrap: "wrap" }}>
        <div 
          className="user-avatar" 
          style={{ 
            width: "80px", 
            height: "80px", 
            fontSize: "2.2rem", 
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
            border: "2px solid rgba(255,255,255,0.1)"
          }}
        >
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h1 className="show-paste-title" style={{ marginBottom: "4px" }}>
            {userProfile.username}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "8px" }}>
            ✉ {userProfile.email}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span className="badge badge-primary">Joined {moment(userProfile.createdAt).format("MMMM YYYY")}</span>
            <span className="badge badge-success">Active Member</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-lg)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-primary)" }}>{pastes.length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Pastes</div>
          </div>
        </div>
      </div>

      {/* Pastes List Grid Section */}
      <div>
        <div className="latest-header" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)", alignItems: "center" }}>
          <div className="page-title" style={{ marginBottom: 0 }}>
            <div className="title-icon">📋</div>
            My Pastes
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-sm)", width: "100%", maxWidth: "320px" }} className="input-with-icon">
            <span className="input-icon">🔍</span>
            <input
              type="text"
              placeholder="Search pastes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern"
              style={{ border: "none", background: "none", padding: "10px 12px 10px 0" }}
            />
          </div>
        </div>

        {filteredPastes.length === 0 ? (
          <div className="empty-state card-glass" style={{ padding: "var(--space-2xl)" }}>
            <div className="empty-icon">📋</div>
            <div className="empty-title">
              {searchTerm ? "No matching pastes found" : "No pastes published yet"}
            </div>
            <div className="empty-subtitle">
              {searchTerm ? "Try searching for a different keyword." : "Your published pastes will be listed here."}
            </div>
          </div>
        ) : (
          <div className="pastes-container">
            {/* Column Header Row */}
            <div className="pastes-header-row">
              <div className="col-header title-col">Title</div>
              <div className="col-header date-col">Date Created</div>
              <div className="col-header expiry-col">Expiration</div>
              <div className="col-header actions-col">Actions</div>
            </div>

            <div className="pastes-grid">
              {filteredPastes.map((paste, i) => {
                const pasteLink = `${window.location.origin}/paste/${paste.idx}`;
                const isExpired = paste.expireAt && new Date(paste.expireAt) < new Date();

                return (
                  <div className="paste-card" key={paste.idx} style={{ animationDelay: `${i * 0.03}s` }}>
                    {/* Title Column */}
                    <div className="paste-col title-col">
                      <div className="paste-card-icon">📄</div>
                      <div className="paste-card-title-wrapper">
                        <div className="paste-card-title">{paste.title || "Untitled Paste"}</div>
                        <div className="mobile-meta-only">
                          {moment(paste.createdAt).format("MMM D, YYYY")}
                        </div>
                      </div>
                    </div>

                    {/* Date Column */}
                    <div className="paste-col date-col">
                      <span className="date-text">
                        {moment(paste.createdAt).format("MMM D, YYYY")}
                      </span>
                    </div>

                    {/* Expiration Column */}
                    <div className="paste-col expiry-col">
                      {isExpired ? (
                        <span className="badge badge-danger">Expired</span>
                      ) : paste.expireAt ? (
                        <span className="badge badge-warning">
                          {moment(paste.expireAt).fromNow()}
                        </span>
                      ) : (
                        <span className="badge badge-success">Permanent</span>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="paste-col actions-col">
                      <div className="paste-card-actions">
                        <a href={pasteLink} className="paste-goto-link">
                          View →
                        </a>
                        <button
                          className="btn-icon"
                          title="Edit"
                          onClick={() => handleEdit(paste.idx)}
                        >
                          ✎
                        </button>
                        <button
                          className="btn-icon danger"
                          title="Delete"
                          onClick={() => handleDelete(paste.idx)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
