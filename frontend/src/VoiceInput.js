import React, { useState } from "react";

function VoiceInput({ onCommand }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition(); // Chrome only
    recognition.lang = "en-IN"; 
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      onCommand(text); // send to backend
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startListening}>
        {listening ? "Listening..." : "Speak to add/remove items"}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}

export default VoiceInput;
