import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import { auth, onAuthStateChanged } from "./firebase";
import GuestBanner from "./GuestBanner";
import Navbar from "./Navbar";
import PageBackground from "./PageBackground";

const RAW_API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_CANDIDATES = RAW_API_URL.split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);
const DEFAULT_API = API_CANDIDATES[0] || "http://localhost:8000";

const SUGGESTIONS = [
  "Explain the Pythagorean theorem",
  "Summarise the causes of WW1",
  "What is photosynthesis?",
  "Help me make a study plan",
];

function DarwinAvatar({ size = 36 }) {
  return (
    <div className="darwin-avatar" style={{ width: size, height: size }}>
      🤖
    </div>
  );
}

function Bubble({ msg, isNew }) {
  const isUser = msg.sender === "You";
  return (
    <motion.div
      className={`chat-bubble ${isUser ? "user" : "bot"}`}
      initial={isNew ? { opacity: 0, y: 12, scale: 0.97 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    >
      {!isUser && <DarwinAvatar />}
      <div className="bubble-body">
        <p className="bubble-text">{msg.text}</p>
        <span className="bubble-time">{msg.time}</span>
      </div>
    </motion.div>
  );
}

function Chatbot() {
  const [user, setUser]               = useState(null);
  const [prompt, setPrompt]           = useState("");
  const [file, setFile]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [inputType, setInputType]     = useState("text");
  const [additionalInput, setAdditionalInput] = useState("");
  const [serverOk, setServerOk]       = useState(null);
  const [apiUrl, setApiUrl]           = useState(DEFAULT_API);
  const [newMsgIdx, setNewMsgIdx]     = useState(-1);
  const [chatHistory, setChatHistory] = useState([{
    sender: "Darwin",
    text: "Hey! I'm Darwin 👋 — your AI study assistant. Ask me anything, upload a PDF, or share an image.",
    time: now(),
  }]);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const fileRef    = useRef(null);

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => { const u = onAuthStateChanged(auth, setUser); return u; }, []);

  useEffect(() => {
    const check = async () => {
      // Try each candidate in order and pick the first reachable backend
      for (const candidate of API_CANDIDATES) {
        try {
          const res = await fetch(`${candidate}/health`, { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            setApiUrl(candidate);
            setServerOk(true);
            return;
          }
        } catch (e) {
          // try next candidate
        }
      }
      // retry a couple times before marking offline
      try {
        await new Promise(r => setTimeout(r, 2000));
        for (const candidate of API_CANDIDATES) {
          try {
            const res = await fetch(`${candidate}/health`, { signal: AbortSignal.timeout(5000) });
            if (res.ok) {
              setApiUrl(candidate);
              setServerOk(true);
              return;
            }
          } catch {}
        }
      } catch {}
      setServerOk(false);
    };
    check();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const addMsg = (sender, text) => {
    setChatHistory(prev => {
      const next = [...prev, { sender, text, time: now() }];
      setNewMsgIdx(next.length - 1);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userText = inputType === "text" ? prompt.trim() : (file?.name || "File uploaded");
    if (!userText && !file) return;

    if (serverOk === false) {
      addMsg("Darwin", "🔄 Waking up the server… This may take 30–60 seconds. Please wait.");
      // Attempt to wake each candidate
      for (const c of API_CANDIDATES) fetch(`${c}/health`).catch(() => {});
    }

    addMsg("You", userText);
    setPrompt("");
    setLoading(true);

    try {
      let res;
      const opts = { signal: AbortSignal.timeout(90000) };
      if (inputType === "text") {
        res = await fetch(`${apiUrl}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userText, inputType, additionalInput }),
          ...opts,
        });
      } else {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("inputType", inputType);
        fd.append("additionalInput", additionalInput);
        res = await fetch(`${apiUrl}/chat`, { method: "POST", body: fd, ...opts });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setServerOk(true);
      addMsg("Darwin", data.response || "No response received.");
    } catch (err) {
      addMsg("Darwin", err.name === "AbortError"
        ? "⏱️ Request timed out. Server may still be starting — try again in a moment."
        : "⚠️ Couldn't reach the server. Make sure the backend is running.");
      setServerOk(false);
    } finally {
      setLoading(false);
      setFile(null);
      setAdditionalInput("");
    }
  };

  const handleSuggestion = (s) => {
    setInputType("text");
    setPrompt(s);
    inputRef.current?.focus();
  };

  return (
    <div className="page-wrapper">
      <PageBackground />
      <Navbar user={user} />
      {!user && <GuestBanner />}

      <div className="chatbot-page">

        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="darwin-header-avatar">🤖</div>
            <div>
              <h1 className="chat-title">Darwin AI</h1>
              <p className="chat-subtitle">Powered by Gemini · Your study companion</p>
            </div>
          </div>
          <div className={`server-status ${serverOk === null ? "checking" : serverOk ? "online" : "offline"}`}>
            <span className="status-dot" />
            {serverOk === null ? "Connecting…" : serverOk ? "Online" : "Offline"}
          </div>
        </div>

        {/* Messages */}
        <div className="chat-window">
          {chatHistory.map((msg, i) => (
            <Bubble key={i} msg={msg} isNew={i === newMsgIdx} />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="chat-bubble bot"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <DarwinAvatar />
                <div className="bubble-body">
                  <p className="bubble-text typing">
                    <span /><span /><span />
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Suggestions — only show when 1 message (intro) */}
        {chatHistory.length === 1 && !loading && (
          <div className="suggestions-row">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="suggestion-chip" onClick={() => handleSuggestion(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="chat-input-area">
          <div className="input-type-tabs">
            {["text", "image", "pdf"].map((t) => (
              <button
                key={t}
                className={inputType === t ? "active" : ""}
                onClick={() => { setInputType(t); setFile(null); }}
              >
                {t === "text" ? "💬 Text" : t === "image" ? "🖼 Image" : "📄 PDF"}
              </button>
            ))}
          </div>

          <form className="input-row" onSubmit={handleSubmit}>
            {inputType === "text" ? (
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Darwin anything…"
                disabled={loading}
                autoComplete="off"
              />
            ) : (
              <div className="file-input-group">
                <label className="file-label" onClick={() => fileRef.current?.click()}>
                  {file ? `📎 ${file.name}` : `Upload ${inputType === "image" ? "Image" : "PDF"}`}
                  <input
                    ref={fileRef}
                    type="file"
                    accept={inputType === "image" ? "image/*" : "application/pdf"}
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </label>
                <input
                  type="text"
                  value={additionalInput}
                  onChange={(e) => setAdditionalInput(e.target.value)}
                  placeholder="Add a question about this file…"
                  disabled={loading}
                />
              </div>
            )}
            <button type="submit" disabled={loading || (!prompt.trim() && !file)} className="send-btn">
              {loading ? (
                <span className="send-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
