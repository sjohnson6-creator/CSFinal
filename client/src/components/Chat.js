import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://YOUR_VM_IP:3001");

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (text.trim() === "") return;
    socket.emit("message", `${user.email}: ${text}`);
    setText("");
  };

  const analyzeImage = async () => {
    if (!file) return alert("Select an image first");
    const buffer = await file.arrayBuffer();

    const res = await fetch("http://YOUR_VM_IP:3001/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: buffer,
    });

    const data = await res.json();
    if (data.tagsResult && data.tagsResult.values) {
      setTags(data.tagsResult.values.map((t) => t.name));
    }
  };

  return (
    <div className="chat-container">
      <h2>Welcome, {user.email}</h2>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <h3>Image Analysis</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={analyzeImage}>Analyze</button>

      <div className="tags">
        {tags.map((t, i) => (
          <span key={i} className="tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
