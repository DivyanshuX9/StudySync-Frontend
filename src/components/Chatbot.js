import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import { FaPaperPlane } from "react-icons/fa";

function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [chatHistory, setChatHistory] = useState([]);
  const [additionalInput, setAdditionalInput] = useState("");

  useEffect(() => {
    setChatHistory([{ sender: "Darwin", text: "Hello! I am Darwin, your AI assistant. How can I help you today?" }]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let url = "https://study-sync-backend-5b8v.onrender.com/chat";
    let options = {};

    try {
      if (inputType === "text") {
        // Sending text prompt
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, inputType, additionalInput }),
        };
      } else if (inputType === "image" || inputType === "pdf") {
        // Sending image or PDF with additional input
        const formData = new FormData();
        formData.append("file", file); // appending the file to FormData
        formData.append("inputType", inputType); // Appending input type (image/pdf)
        formData.append("additionalInput", additionalInput); // Appending additional input

        url = "http://localhost:8000/chat"; // The media endpoint
        options = { method: "POST", body: formData };
      }

      setChatHistory([...chatHistory, { sender: "You", text: prompt }]);
      setPrompt(""); // Clear input field

      const res = await fetch(url, options);
      const data = await res.json();

      if (data.response) {
        setResponse(data.response);
        setChatHistory([...chatHistory, { sender: "You", text: prompt }, { sender: "Darwin", text: data.response }]);
      } else {
        setResponse("No response received");
      }
    } catch (error) {
      setResponse("Error connecting to the backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">How can I help you today?</h1>
      <p className="chatbot-subtitle">Type your query below or select a media file.</p>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <p key={index} className={msg.sender === "You" ? "user-msg" : "bot-msg"}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div className="chatbot-options">
        <button className={inputType === "text" ? "active" : ""} onClick={() => setInputType("text")}>Text</button>
        <button className={inputType === "image" ? "active" : ""} onClick={() => setInputType("image")}>Image</button>
        <button className={inputType === "pdf" ? "active" : ""} onClick={() => setInputType("pdf")}>PDF</button>
      </div>
      <div className="input-section">
        {inputType === "text" ? (
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
          />
        ) : (
          <div>
            <input
              type="file"
              accept={inputType === "image" ? "image/*" : "application/pdf"}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <input
              type="text"
              value={additionalInput}
              onChange={(e) => setAdditionalInput(e.target.value)}
              placeholder="Enter additional input"
            />
          </div>
        )}
        <button onClick={handleSubmit} disabled={loading} className="send-button">
          {loading ? "..." : <FaPaperPlane />}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
