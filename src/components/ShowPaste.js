import React, { useEffect, useState } from "react";
import moment from "moment";
import { userRequest } from "../requestMethods";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/clike/clike.js";
import "./NewPaste.css";

const languageModes = {
  plaintext: null,
  javascript: "javascript",
  python: "python",
  markdown: "markdown",
  htmlmixed: "htmlmixed",
  css: "css",
  clike: "clike"
};

const languageLabels = {
  plaintext: "Plain Text",
  javascript: "JavaScript",
  python: "Python",
  markdown: "Markdown",
  htmlmixed: "HTML",
  css: "CSS",
  clike: "C / C++ / Java / C#"
};

export default function ShowPaste(props) {
  const [paste, setPaste] = useState(null);
  const [rawOpen, setRawOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const idx = props.match.params.idx;

  useEffect(() => {
    userRequest.get(`paste/get/${idx}`).then((res) => setPaste(res.data));
  }, [idx]);

  const shareLink = `${window.location.origin}/paste/${idx}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRawClick = (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      alert("Please sign in to view the raw format.");
    }
  };

  if (!paste) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">📋</div>
        <div className="empty-title">Loading paste…</div>
        <div className="empty-subtitle">Please wait a moment.</div>
      </div>
    );
  }

  if (paste === null || paste.error) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">⚠️</div>
        <div className="empty-title">Paste not found</div>
        <div className="empty-subtitle">
          This paste may have expired or does not exist.
        </div>
      </div>
    );
  }

  const isExpired = paste.expireAt && new Date(paste.expireAt) < new Date();

  return (
    <div className="show-paste-wrapper fade-in">
      {/* ── Hero Header ── */}
      <div className="show-paste-hero">
        <div>
          <h1 className="show-paste-title">{paste.title || "Untitled Paste"}</h1>
          <div className="show-paste-meta">
            <span className="badge badge-primary">📄 Paste</span>
            {isExpired ? (
              <span className="badge badge-danger">⏰ Expired</span>
            ) : paste.expireAt ? (
              <span className="badge badge-warning">
                ⏳ Expires {moment(paste.expireAt).fromNow()}
              </span>
            ) : (
              <span className="badge badge-success">✅ Never Expires</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Code Editor (read-only) ── */}
      <div className="show-paste-editor-card">
        <div className="show-editor-header">
          <div className="editor-dots">
            <div className="editor-dot" />
            <div className="editor-dot" />
            <div className="editor-dot" />
          </div>
          <div className="editor-lang-badge">
            <span>⚡</span> {languageLabels[paste.language] || "Plain Text"} · Read Only
          </div>
        </div>
        <CodeMirror
          value={paste.paste}
          options={{
            mode: languageModes[paste.language],
            theme: "material",
            lineNumbers: true,
            readOnly: true,
            lineWrapping: true,
          }}
        />
      </div>

      {/* ── RAW Collapsible ── */}
      <div className="raw-section">
        <div
          className="raw-section-header"
          onClick={() => setRawOpen((o) => !o)}
        >
          <span className="raw-section-label">
            <span>{ }</span> RAW Format
          </span>
          <span className={`raw-toggle-icon${rawOpen ? " open" : ""}`}>▼</span>
        </div>
        {rawOpen && (
          <textarea
            className="raw-textarea"
            defaultValue={paste.paste}
            readOnly
          />
        )}
      </div>

      {/* ── Info + Share ── */}
      <div className="show-info-share">
        <div className="info-card">
          <div className="info-card-title">Paste Information</div>
          <div className="info-row">
            <span className="info-row-icon">📅</span>
            <span className="info-row-label">Posted</span>
            <span className="info-row-value">
              {moment(paste.createdAt).format("MMM D, YYYY · h:mm A")}
            </span>
          </div>
          <div className="info-row">
            <span className="info-row-icon">⏰</span>
            <span className="info-row-label">Expires</span>
            <span className="info-row-value">
              {paste.expireAt
                ? moment(paste.expireAt).format("MMM D, YYYY · h:mm A")
                : "Never"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-row-icon">🔑</span>
            <span className="info-row-label">ID</span>
            <span className="info-row-value" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem" }}>
              {paste.idx}
            </span>
          </div>
        </div>

        <div className="share-card">
          <div className="share-card-title">Share this Paste</div>
          <div className="share-input-row">
            <input
              id="share"
              type="text"
              className="share-input"
              value={shareLink}
              readOnly
            />
            <button
              className={`copy-btn${copied ? " copied" : ""}`}
              onClick={handleCopy}
              style={{ marginRight: "6px" }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
            <a
              className="copy-btn"
              href={`${process.env.REACT_APP_API_URL || "http://localhost:5000/"}paste/raw/${idx}?token=${localStorage.getItem("token")}`}
              target="_blank"
              rel="noreferrer"
              onClick={handleRawClick}
              style={{
                background: "transparent",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              Raw ↗
            </a>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "10px" }}>
            Share this link to let others view your paste.
          </p>
        </div>
      </div>
    </div>
  );
}
