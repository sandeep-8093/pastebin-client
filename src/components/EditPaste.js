import React, { useEffect, useState } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import { useHistory, useParams } from "react-router-dom";
import { userRequest } from "../requestMethods";
import { Controlled as CodeMirror } from "react-codemirror2";
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

export default function EditPaste() {
  const [title, setTitle]               = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [timeout, setTimeoutValue]      = useState(0);
  const [language, setLanguage]         = useState("plaintext");
  const [submitting, setSubmitting]     = useState(false);
  const { pasteId: paramPasteID }       = useParams();
  let history = useHistory();

  useEffect(() => {
    userRequest
      .get(`paste/get/${paramPasteID}`)
      .then((response) => {
        const { title, paste, expireAt, language } = response.data;
        setTitle(title);
        setPasteContent(paste);
        if (language) setLanguage(language);
        if (expireAt) {
          const mins = Math.floor((new Date(expireAt).getTime() - Date.now()) / 60000);
          setTimeoutValue(Math.max(0, mins));
        }
      })
      .catch((err) => console.error("Error fetching paste:", err));
  }, [paramPasteID]);

  function submitPaste() {
    setSubmitting(true);
    const exp_date = timeout > 0
      ? new Date(Date.now() + timeout * 60 * 1000)
      : null;

    userRequest
      .put(`paste/edit/${paramPasteID}`, {
        title,
        paste: pasteContent,
        expireAt: exp_date,
        language: language,
      })
      .then(() => {
        M.toast({ html: "✅ Paste updated successfully!" });
        history.push("/paste/" + paramPasteID);
      })
      .catch((err) => {
        setSubmitting(false);
        console.error("Error updating paste:", err);
        M.toast({ html: "❌ Failed to update paste." });
      });
  }

  const shareLink = `${window.location.origin}/paste/${paramPasteID}`;

  return (
    <div className="fade-in">
      <div className="page-title">
        <div className="title-icon">✎</div>
        Edit Paste
      </div>

      <div className="paste-editor-layout">
        {/* ── Editor Column ── */}
        <div className="editor-panel">
          <div className="editor-card">
            <div className="editor-card-header">
              <div className="editor-dots">
                <div className="editor-dot" />
                <div className="editor-dot" />
                <div className="editor-dot" />
              </div>
              <div className="editor-lang-badge">
                <span>⚡</span> {languageLabels[language] || "Plain Text"}
              </div>
            </div>
            <CodeMirror
              value={pasteContent}
              options={{
                mode: languageModes[language],
                theme: "material",
                lineNumbers: true,
                viewportMargin: Infinity,
                lineWrapping: true,
              }}
              onBeforeChange={(editor, data, value) => setPasteContent(value)}
            />
          </div>
        </div>

        {/* ── Sidebar Column ── */}
        <div className="sidebar-panel">
          <div className="sidebar-card">
            <div className="sidebar-section">
              <div className="input-group">
                <label className="input-label" htmlFor="ep-title">Paste Title</label>
                <div className="input-with-icon">
                  <span className="input-icon">✏</span>
                  <input
                    id="ep-title"
                    type="text"
                    className="input-modern"
                    placeholder="Paste Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="input-group">
                <label className="input-label" htmlFor="ep-timeout">Expiry (minutes)</label>
                <div className="input-with-icon">
                  <span className="input-icon">⏱</span>
                  <input
                    id="ep-timeout"
                    type="number"
                    min="0"
                    className="input-modern"
                    value={timeout}
                    onChange={(e) => setTimeoutValue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="input-group">
                <label className="input-label" htmlFor="ep-language">Language Syntax</label>
                <div className="input-with-icon">
                  <span className="input-icon">💻</span>
                  <select
                    id="ep-language"
                    className="input-modern"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ display: "block", width: "100%", height: "42px", padding: "0 10px" }}
                  >
                    <option value="plaintext">Plain Text</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="markdown">Markdown</option>
                    <option value="htmlmixed">HTML</option>
                    <option value="css">CSS</option>
                    <option value="clike">C / C++ / Java / C#</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="input-group">
                <label className="input-label">Paste Link</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔗</span>
                  <input
                    type="text"
                    className="input-modern"
                    value={shareLink}
                    readOnly
                    style={{ color: "var(--text-muted)", cursor: "default" }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={submitPaste}
              className="btn-primary sidebar-submit"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "✎ Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
