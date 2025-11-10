// App.jsx
import React from "react";
import Login from "./pages/LoginPage";
import StarmuCreation from "./pages/StarmuCreation";
import Register from "./pages/RegisterPage";
import ScreenFrame from "./pages/ScreenFrame";
import "./App.css";
import StarmuPage from "./pages/StarmuPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <ScreenFrame>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/starmu-creation" element={<StarmuCreation />} />
          <Route path="/starmu-page" element={<StarmuPage />} />
        </Routes>
      </ScreenFrame>
    </Router>
  );
}