import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./Chatbot.css";
import { auth, onAuthStateChanged } from "./firebase";
import Navbar from "./Navbar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Chatbot() {
  const [user, setUser] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [additionalInput, setAdditionalInput] = useState("");
  const [serverOk, setServerOk] = useState(null); // null=checking, true=ok, false=down
  const [chatHistory, setChatHistory] = useState([
    { sender: "Darwin", text: "Hello! I'm Darwin, your AI study assistant. Ask me anything or upload a PDF/image." }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  // Health check on mount with retry mechanism
  useEffect(() => {
    const checkServer = async (attempt = 0) => {
      try {
        const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          setServerOk(true);
        } else {
          setServerOk(false);
        }
      } catch (err) {
        if (attempt < 2) {
          // Retry after 3 seconds
          setTimeout(() => checkServer(attempt + 1), 3000);
        } else {
          setServerOk(false);
        }
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userText = inputType === "text" ? prompt : (file?.name || "File uploaded");
    if (!userText.trim() && !file) return;

    // Wake up server if offline
    if (serverOk === false) {
      setChatHistory((prev) => [...prev, { sender: "Darwin", text: "🔄 Waking up the server... This may take 30-60 seconds on first call. Please wait." }]);
      // Trigger wake-up call
      fetch(`${API_URL}/health`).catch(() => {});
    }

    setChatHistory((prev) => [...prev, { sender: "You", text: userText }]);
    setPrompt("");
    setLoading(true);

    try {
      let res;
      const requestOptions = { signal: AbortSignal.timeout(90000) }; // 90s timeout for cold start
      
      if (inputType === "text") {
        res = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, inputType, additionalInput }),
          ...requestOptions
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("inputType", inputType);
        formData.append("additionalInput", additionalInput);
        res = await fetch(`${API_URL}/chat`, { method: "POST", body: formData, ...requestOptions });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // Update server status to online
      setServerOk(true);
      
      setChatHistory((prev) => [...prev, {
        sender: "Darwin",
        text: data.response || "No response received.",
      }]);
    } catch (err) {
      const errorMsg = err.name === 'AbortError' 
        ? "⏱️ Request timed out. Server may still be starting. Try again in a moment."
        : "⚠️ Error connecting to the server. Make sure the backend is running.";
      setChatHistory((prev) => [...prev, { sender: "Darwin", text: errorMsg }]);
      setServerOk(false);
    } finally {
      setLoading(false);
      setFile(null);
      setAdditionalInput("");
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar user={user} />
      <div className="chatbot-page">
        <div className="chat-header">
          <div className="chat-header-top">
            <div>
              <h1>🤖 Darwin AI</h1>
              <p>Your intelligent study assistant</p>
            </div>
            <div className={`server-status ${serverOk === null ? 'checking' : serverOk ? 'online' : 'offline'}`}>
              <span className="status-dot" />
              {serverOk === null ? 'Connecting…' : serverOk ? 'Server online' : 'Server offline — start backend'}
            </div>
          </div>
        </div>

        <div className="chat-window">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.sender === "You" ? "user" : "bot"}`}>
              <span className="bubble-sender">{msg.sender}</span>
              <p className="bubble-text">{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble bot">
              <span className="bubble-sender">Darwin</span>
              <p className="bubble-text typing">
                <span /><span /><span />
              </p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <div className="input-type-tabs">
            {["text", "image", "pdf"].map((t) => (
              <button key={t} className={inputType === t ? "active" : ""} onClick={() => { setInputType(t); setFile(null); }}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <form className="input-row" onSubmit={handleSubmit}>
            {inputType === "text" ? (
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Darwin anything..."
                disabled={loading}
              />
            ) : (
              <div className="file-input-group">
                <label className="file-label">
                  {file ? `📎 ${file.name}` : `Upload ${inputType === "image" ? "Image" : "PDF"}`}
                  <input
                    type="file"
                    accept={inputType === "image" ? "image/*" : "application/pdf"}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
                <input
                  type="text"
                  value={additionalInput}
                  onChange={(e) => setAdditionalInput(e.target.value)}
                  placeholder="Add a question about this file..."
                  disabled={loading}
                />
              </div>
            )}
            <button type="submit" disabled={loading} className="send-btn">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
