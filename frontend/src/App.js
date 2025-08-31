import React, { useState } from "react";
import axios from "axios";
import VoiceInput from "./VoiceInput";

function App() {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const res = await axios.get("https://fastapi-shopping.onrender.com/list/");
    setList(res.data);
  };

  const handleVoiceCommand = async (command) => {
    await axios.post("https://fastapi-shopping.onrender.com/parse_command/", {
      text: command,
    });
    fetchList();
  };

  return (
    <div>
      <h1>Shopping Assistant</h1>
      <VoiceInput onCommand={handleVoiceCommand} />
      <button onClick={fetchList}>Refresh List</button>
      <ul>
        {list.map((i) => (
          <li key={i.id}>
            {i.item} ({i.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
