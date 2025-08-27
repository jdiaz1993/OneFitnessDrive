import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import introVideo from "./assets/introOneDrive.mp4"; // <-- import hashed asset

export default function SplashVideo() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;

    const handleEnded = () => navigate("/home");
    const tryPlay = () => v.play().catch(err => console.warn("Autoplay blocked:", err));

    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("canplay", tryPlay, { once: true });

    v.addEventListener("ended", handleEnded);
    return () => {
      v.removeEventListener("ended", handleEnded);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [navigate]);

  return (
    <div style={{ height:"100vh", width:"100vw", overflow:"hidden",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
<video ref={videoRef} autoPlay muted playsInline preload="auto"
       style={{ width:"100%", height:"70%", objectFit:"cover" }}>
  <source src={introVideo} type="video/mp4" />   {/* <-- use the import */}
</video>
    </div>
  );
}
