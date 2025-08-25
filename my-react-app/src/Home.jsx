import React from "react";
import ProgressCarousel from "./components/ProgressCarousel";
import "./home.css";
import { Link } from "react-router-dom";
import Reviews from "./components/Reviews"; // Import Reviews component

export default function Home() {
  // const boxStyle = {
  //   width: "100%",
  //   padding: "20px",
  //   border: "2px solid black",
  //   boxSizing: "border-box",
  //   backgroundColor: "rgba(138, 136, 136, 0.8)",
  //   fontSize: "0.9rem",
  //   display: "flex",
  //   flexDirection: "column",
  // };

  return (

<div className="home container-fluid px-0 py-4 mt-3">
 
  <div className="row g-0 home-header">
    <div className="col-12 p-0">
      <div >
        <div className="row g-0">
          <div className="col-12 col-lg-6 p-3 p-lg-4">
            <h1 className="text-dark text-center text-lg-start">One Drive Fitness Training</h1>
            <p className="text-dark mb-0">
           Welcome to One Drive Fitness, where personalized training delivers real results. I design custom fitness programs tailored to your goals, whether you want to build strength, improve mobility, boost endurance, or enhance overall health.

With expert guidance, proven methods, and a focus on proper form, I help you train smarter, stay motivated, and achieve lasting results. Every workout is designed to fit your lifestyle, challenge your limits, and keep you progressing toward your best self.
            </p>
          </div>

          {/* <div className="col-12 col-lg-6 p-3 p-lg-4">
            <div className="video-container">
              <iframe
                src="https://www.youtube-nocookie.com/embed/uan3Aj0bHKc"
                title="Casually Explained: Being Healthy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  </div>

  <div className="row g-0 mt-3 home-middle mt-5">
    <div className="col-12 p-0">
      <div >
        <h1 className="text-dark text-center mb-3">A Few Clients</h1>
        <div className="px-2 px-sm-3">
          <ProgressCarousel mode="contain" minPx={240} maxVh="55vh" maxPx={640} />
        </div>
      </div>
    </div>
  </div>

  <div className="row g-0 mt-3">
    <div className="col-12 p-0">

      <div className="home-third mt-5 mb-3">
        <h1 className="text-dark text-center mb-4">Personalized Goals</h1>
        <div className="container text-center">
  <div className="row align-items-start">
    <div className="col align-self-start">
      <h3 className="text-dark mb-3">Personalized Training</h3>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        <li className="text-dark">Custom workouts designed around your goals</li>
        <li className="text-dark mt-3">Tailored for strength, mobility, and endurance</li>
        <li className="text-dark mt-3">No cookie-cutter programs</li>
      </ul>
      
    </div>
    <div className="col">
       <h3 className="text-dark mb-3">Total Lifestyle Coaching</h3>
       <ul className="mb-5" style={{ listStyleType: "none", paddingLeft: 0 }}>
        <li className="text-dark">Flexible scheduling that fits your life</li>
        <li className="text-dark mt-3">Nutrition guidance (calories & macros)</li>
        <li className="text-dark mt-3">Meal suggestions & supplement advice</li>
      </ul>
    </div>
    <div className="col">
       <h3 className="text-dark mb-3">Results & Accountability</h3>
       <ul className="mb-5" style={{ listStyleType: "none", paddingLeft: 0 }}>
        <li className="text-dark">Bi-weekly check-ins & body measurements</li>
        <li className="text-dark mt-3">Access to training app & workout videos</li>
        <li className="text-dark mt-3">24/7 trainer communication via text</li>
      </ul>
    </div>
  </div>
<Link 
  to="/plans" 
  className="btn btn-primary mt-3 mb-3 rounded-button" 
  style={{ width: "200px" }}
>
  Click for More
</Link>
</div>
         
        
      </div>
    </div>
  </div>

< Reviews />

</div>

  );
}
