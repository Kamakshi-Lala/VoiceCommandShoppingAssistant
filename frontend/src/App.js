import React, { useState, useEffect } from "react";
import axios from "axios";
import VoiceInput from "./VoiceInput";
import "./App.css";   

function App() {
  const [list, setList] = useState([]);
  const [feedback, setFeedback] = useState("");

  const fetchList = async () => {
    const res = await axios.get("https://shopping-assistant-74lt.onrender.com/list/");
    setList(res.data);
  };

  useEffect(() => {
    fetchList();
  }, []);

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
      setFeedback("Error. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>🛒 SHOPPING ASSISTANT</h1>

      <div style={{ marginBottom: "20px" }}>
        <VoiceInput onCommand={handleVoiceCommand} />
      </div>

      {feedback && <div className="feedback">{feedback}</div>}

      <button onClick={fetchList}>Refresh List</button>

      <ul>
        {list.map((i) => (
          <li key={i.id}>
            {i.item} <span style={{ color: "#7f8c8d" }}>({i.quantity})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
