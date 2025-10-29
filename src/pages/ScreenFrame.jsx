//ScreenFrame.jsx

// to wrap every page with consistent frame and background

import React from "react";
import "../css/ScreenFrame.css";

function ScreenFrame({ children }) {
  return (
    <div className="screen-container w-full h-screen">
      <div className="screen-frame">{children}</div>
    </div>
  );
}

export default ScreenFrame;