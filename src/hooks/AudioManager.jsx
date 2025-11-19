import React, { useRef, createContext, useContext, useState, useEffect } from "react";

const AudioContext = createContext(null);
export const useAudio = () => useContext(AudioContext);

export const AudioManager = ({ children }) => {
    const bgRef = useRef(null);
    const clickRef = useRef(null);
    const successRef = useRef(null);

    const [bgStarted, setBgStarted] = useState(false);

    const startBg = () => {
        if (bgStarted) return;
        const bg = bgRef.current;
        if (!bg) return;

        bg.muted = false;
        bg.volume = 0.2; // safe only AFTER user interaction
        bg.play()
            .then(() => {
                setBgStarted(true);
                console.log("🎵 Background music started");
            })
            .catch(err => console.log("BG play failed:", err));
    };

    const playClick = () => {
        startBg(); // auto-start bg music on first click

        const a = clickRef.current;
        if (!a) return;
        a.currentTime = 0;
        a.play();
    };

    const playSuccess = () => {
        const a = successRef.current;
        if (!a) return;
        a.currentTime = 0;
        a.play();
    };

    useEffect(() => {
        const handleUserClick = () => {
            startBg();
            window.removeEventListener("click", handleUserClick);
        };

        window.addEventListener("click", handleUserClick);

        return () => window.removeEventListener("click", handleUserClick);
    }, []); // run once

    const contextValue = { playClick, playSuccess };

    return (
        <AudioContext.Provider value={contextValue}>
            <audio
                ref={bgRef}
                src="/audio/bg.mp3"
                loop
                preload="auto"
                muted    // required to avoid autoplay blocking before click
            />

            <audio
                ref={clickRef}
                src="/audio/click.mp3"
                preload="auto"
            />

            <audio
                ref={successRef}
                src="/audio/success.mp3"
                preload="auto"
            />

            {children}
        </AudioContext.Provider>
    );
};
