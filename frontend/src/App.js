import React, { useState } from "react";
import axios from "axios";
import VoiceInput from "./VoiceInput";

function App() {
  const [list, setList] = useState([]);
  const [feedback, setFeedback] = useState("");
  
  const fetchList = async () => {
    const res = await axios.get("https://shopping-assistant-74lt.onrender.com/list/");
    setList(res.data);
  };

  const handleVoiceCommand = async (command) => {
    try {
      const res = await axios.post("https://shopping-assistant-74lt.onrender.com/parse_command/", {
        text: command,
      });

      if (res.data.message) {
        setFeedback(res.data.message);
      } else {
        setFeedback(`Processed: "${command}"`);
      }

      fetchList();
    } catch (err) {
      setFeedback("Error Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
        backgroundColor: "#f4f6f9",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>
        🛒 Shopping Assistant
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <VoiceInput onCommand={handleVoiceCommand} />
      </div>

      {/* Real-time feedback */}
      {feedback && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px 15px",
            borderRadius: "6px",
            backgroundColor: "#ecf0f1",
            color: "#2c3e50",
            fontSize: "16px",
            fontStyle: "italic",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {feedback}
        </div>
      )}

      <button
        onClick={fetchList}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#3498db",
          color: "white",
          cursor: "pointer",
          marginBottom: "30px",
        }}
      >
        Refresh List
      </button>

      <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: "400px" }}>
        {list.map((i) => (
          <li
            key={i.id}
            style={{
              background: "#fff",
              margin: "10px 0",
              padding: "12px 16px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              textAlign: "center",
              fontSize: "18px",
              color: "#34495e",
            }}
          >
            {i.item} <span style={{ color: "#7f8c8d" }}>({i.quantity})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
