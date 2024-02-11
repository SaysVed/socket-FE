import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Connect to the server
console.log(socket);

function ChatApp() {
  const [sender, setSender] = useState({
    name: "",
    msg: "",
    email: "king2345kong@gmail.com",
  });

  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sender.msg) {
      socket.emit("newMessage", sender);
      setMessages((prevMessages) => [...prevMessages, sender]);
      setSender({ ...sender, msg: "" });
    }
  };

  const handleChange = (e) => {
    setSender({ ...sender, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios.get("http://localhost:5000/loadMsgs").then((res) => {
      setMessages(res.data);
    });

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
    <div className="container mx-auto p-4" style={{overflow:"hidden"}}>
      <h1 className="text-3xl font-bold mb-4">Real-time Chat App</h1>

      <input
        type="text"
        name="name"
        value={sender.name}
        placeholder="Enter your name"
        onChange={handleChange}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />

      {connected ? (
        <p className="text-green-500 mb-4">Connected to server</p>
      ) : (
        <p className="text-red-500 mb-4">Disconnected from server</p>
      )}

      <div className="mb-4" style={{overflowY: ""}}>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong className="text-blue-500">{msg.name}: </strong>
            {msg.msg}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          name="msg"
          placeholder="Message"
          value={sender.msg}
          onChange={handleChange}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatApp;
