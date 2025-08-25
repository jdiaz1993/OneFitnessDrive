import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashVideo() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleEnded = () => {
        navigate("/home"); // redirect after video ends
      };

      videoElement.addEventListener("ended", handleEnded);

      return () => {
        videoElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [navigate]);

  return (
    <div style={{ height: "100vh", width: "100%", overflow: "hidden",display: "flex",
        alignItems: "center",
        justifyContent: "center", }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "70%",
          objectFit: "cover",
        }}
      >
        <source src="/introOneDrive.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}
