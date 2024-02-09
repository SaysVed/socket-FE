import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000"); // Connect to the server
console.log(socket);

function App() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Listen for "connected" event from the server
    socket.on("connected", (message) => {
      console.log(message); // Log the message from the server
      setConnected(true);
    });

    // Listen for "disconnect" event from the server
    socket.on("disconnect", () => {
      setConnected(false);
    });

    // Listen for "newMessage" events from the server
    socket.on("newMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up event listeners when component unmounts
    return () => {
      socket.off("connected");
      socket.off("disconnect");
      socket.off("newMessage");
    };
  }, []);

  return (
    <div>
      <h1>Real-time Chat App</h1>
      {connected ? (
        <p>Connected to server</p>
      ) : (
        <p>Disconnected from server</p>
      )}
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.name}: </strong>
            {msg.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
