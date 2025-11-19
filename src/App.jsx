// App.jsx
import React from "react";
import Login from "./pages/LoginPage";
import StarmuCreation from "./pages/StarmuCreation";
import Register from "./pages/RegisterPage";
import ScreenFrame from "./pages/ScreenFrame";
import StarmuPage from "./pages/StarmuPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./store/GameContext";
import { AudioManager } from "./hooks/AudioManager";
import "./App.css";

export default function App() {
  return (
    <Router>
      <AudioManager>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/starmu-creation" element={ <ScreenFrame> <StarmuCreation /> </ScreenFrame>} />
            <Route path="/starmu-page" element={ <ScreenFrame> <StarmuPage /> </ScreenFrame> } />
          </Routes>
        </GameProvider>
      </AudioManager>
    </Router>
  );
}