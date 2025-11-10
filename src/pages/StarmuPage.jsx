//StarmuPage.jsx

// home page after starmu creation
import React from "react";
import "../css/StarmuPage.css";


function StarmuPage() {

    return (
        <div className="starmupage-container">
            <div className="starmu-bg"></div>
            <div className="starmu-home-buttons">
                
            <div className="left-buttons">
                <button className="starmu-btn">?</button>
                <button className="starmu-btn">Daily Login</button>
                <button className="starmu-btn">Store</button>
                <button className="starmu-btn">Inventory</button>
            </div>
             <div className="right-buttons">
                <button className="starmu-btn">Gacha</button>
                <button className="starmu-btn">Customize</button>
            </div>
            </div>

            <div className="starmu-top-panel">
                <div className="starmu-name">Starmu Name</div>
                <div className="starmu-status-panel">
                    <div className="starmu-status health"></div>
                    <div className="starmu-status hunger"></div>
                    <div className="starmu-status happiness"></div>

                    <div className="starmu-status-icon health"></div>
                    <div className="starmu-status-icon hunger"></div>
                    <div className="starmu-status-icon happiness"></div>
                </div>
                <div className="starmu-profile">profile</div>
                    
            </div>

            <div className="starmu-placeholder"></div>
        </div>
      
    );
  }
    
export default StarmuPage;