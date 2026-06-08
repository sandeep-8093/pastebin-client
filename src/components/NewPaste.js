import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { customAlphabet } from "nanoid";
import M from "materialize-css/dist/js/materialize.min.js";
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

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

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

export default function NewPaste() {
  const [title, setTitle]             = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [timeout, setTimeout]         = useState("");
  const [language, setLanguage]       = useState("plaintext");
  const [pasteID, setPasteID]         = useState("");
  const [submitting, setSubmitting]   = useState(false);
  let history = useHistory();

  function submitPaste() {
    setSubmitting(true);
    let exp_date;
    const parsedTimeout = timeout === "" ? 0 : Number(timeout);
    if (!parsedTimeout || parsedTimeout === 0) {
      exp_date = Date.now() + 24 * 60 * 60 * 1000;
    } else if (parsedTimeout > 0) {
      exp_date = new Date(Date.now() + parsedTimeout * 60 * 1000);
    } else {
      exp_date = null;
    }

    const finalPasteID = pasteID.trim() || nanoid();

    userRequest
      .post("paste/add", {
        idx: finalPasteID,
        title: title.trim() || "Untitled Paste",
        paste: pasteContent,
        expireAt: exp_date,
        language: language,
      })
      .then(() => {
        M.toast({ html: "✅ Paste created successfully!" });
        history.push("/paste/" + finalPasteID);
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.response) {
          if (err.response.data === "pasteid-exists") {
            M.toast({ html: "❌ That paste link is already in use!" });
          } else {
            M.toast({ html: err.response.data?.error || err.message });
          }
        } else {
          M.toast({ html: err.message });
        }
      });
  }

  return (
    <div className="fade-in">
      <div className="page-title">
        <div className="title-icon">✦</div>
        New Paste
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
                <label className="input-label" htmlFor="np-title">Paste Title</label>
                <div className="input-with-icon">
                  <span className="input-icon">✏</span>
                  <input
                    id="np-title"
                    type="text"
                    className="input-modern"
                    placeholder="Untitled Paste"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="input-group">
                <label className="input-label" htmlFor="np-timeout">Expiry (minutes)</label>
                <div className="input-with-icon">
                  <span className="input-icon">⏱</span>
                  <input
                    id="np-timeout"
                    type="number"
                    min="0"
                    className="input-modern"
                    placeholder="0 = 24h default"
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="input-group">
                <label className="input-label" htmlFor="np-language">Language Syntax</label>
                <div className="input-with-icon">
                  <span className="input-icon">💻</span>
                  <select
                    id="np-language"
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
                <label className="input-label" htmlFor="np-link">Paste Link</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔗</span>
                  <input
                    id="np-link"
                    type="text"
                    className="input-modern"
                    placeholder="custom-link-id"
                    value={pasteID}
                    onChange={(e) => setPasteID(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={submitPaste}
              className="btn-primary sidebar-submit"
              disabled={submitting}
            >
              {submitting ? "Publishing…" : "✦ Publish Paste"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
