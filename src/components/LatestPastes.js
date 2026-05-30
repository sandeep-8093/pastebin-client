import React, { useEffect, useState } from "react";
import moment from "moment";
import { userRequest } from "../requestMethods";
import { useHistory } from "react-router-dom";
import "./NewPaste.css";

export default function LatestPastes() {
  const [pastes, setPastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    userRequest
      .get("paste/getall")
      .then((res) => {
        setPastes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pastes:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (idx) => {
    userRequest
      .delete(`paste/delete/${idx}`)
      .then(() => {
        setPastes((prev) => prev.filter((p) => p.idx !== idx));
      })
      .catch((err) => console.error("Error deleting paste:", err));
  };

  const handleEdit = (idx) => {
    history.push(`/paste/edit/${idx}`);
  };

  if (loading) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon" style={{ animation: "pulse 1.5s ease infinite" }}>◎</div>
        <div className="empty-title">Loading pastes…</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="latest-header">
        <div className="page-title" style={{ marginBottom: 0 }}>
          <div className="title-icon">◎</div>
          Latest Pastes
        </div>
        {pastes.length > 0 && (
          <span className="latest-count">{pastes.length} paste{pastes.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {pastes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No pastes yet</div>
          <div className="empty-subtitle">
            Create your first paste to see it here.
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
            {pastes.map((paste, i) => {
              const pasteLink = `${window.location.origin}/paste/${paste.idx}`;
              const isExpired = paste.expireAt && new Date(paste.expireAt) < new Date();

              return (
                <div className="paste-card" key={paste.idx} style={{ animationDelay: `${i * 0.05}s` }}>
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
  );
}
