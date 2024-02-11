import React, { useEffect, useState } from "react";
import "./App.css";
import ChatApp from "./Components/ChatApp";
import { Route, Routes } from "react-router-dom";
import RegisterUser from "./Components/RegisterUser";
import Login from "./Components/Login";

function App() {


  return (
    <>
    <Routes>
      <Route path="/chat" element={<ChatApp />} />
      <Route path="*" element={<RegisterUser/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>
    </>
  );
}

export default App;
