// App.jsx
import React from "react";
import Login from "./pages/LoginPage";
import StarmuCreation from "./pages/StarmuCreation";
import Register from "./pages/RegisterPage";
import ScreenFrame from "./pages/ScreenFrame";
import "./App.css";

export default function App() {
  return (
    <ScreenFrame>
      {/*<Login /> */}
      <StarmuCreation />
      {/*<Register />*/}
    </ScreenFrame>
  );
}
