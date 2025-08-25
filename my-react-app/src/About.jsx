import React from "react";
import dannyaboutpicture from "./dannyaboutpicture.jpg";

export default function About() {
  const glassCardStyle ={
            backgroundColor: "rgba(255, 255, 255, 0.1)", // transparent white
            backdropFilter: "blur(50px)", // blur effect
            WebkitBackdropFilter: "blur(10px)", // Safari support
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "20px",
            fontSize: "1.2rem",
            fontWeight: "300",
            fontFamily: "jetbrains-mono, monospace",
            color: "rgba(255, 255, 255, 1)",
  }
  return (
    <div className="container-fluid py-4">
      <h1 className="text-white text-center mb-4">About Me</h1>

      <div className="row g-4 align-items-stretch">
        {/* Image Column */}
        <div className="col-md d-flex">
          <img
            src={dannyaboutpicture}
            alt="aboutpicture"
            style={{ width: "100%", objectFit: "cover", borderRadius: "10px" }}
          />
        </div>

        {/* Text Column with Overlay */}
        <div
          className="col-md d-flex flex-column "
          style={glassCardStyle}
 >
          <p className="mb-3">
            I was born and raised in Los Angeles. As a child, I was always
            active, enjoying outdoor activities and exercise. My passion for
            health and fitness grew over the years, leading me to study
            kinesiology at Rio Hondo College. During my time in community
            college, I worked as a physical therapist aide to enhance my skills
            in injury prevention and recovery. After graduating, I worked at a
            well-known corporate gym, where I combined my academic knowledge and
            practical experience into a career in personal training.
          </p>

          <p className="mb-0">
            If you would like to learn more about my journey, please check out
            this{" "}
            <a href="https://voyagela.com/interview/exploring-life-business-with-danny-gatica-of-one-drive-fitness-training">
              article
            </a>
            . It highlights a deep dive into my experiences, challenges, and the
            lessons I've learned along the way.
          </p>
        </div>
      </div>

      {/* Education & Certification */}
      <div
        className="mt-5"
        style={glassCardStyle}
      >
        <h1 className=" text-center mb-3">Education & Certification:</h1>

        <ul className=" mb-0">
          <li>Rio Hondo College "Fitness Specialist Certification"</li>
          <li>American Red Cross Adult & Child CPR/AED</li>
        </ul>
      </div>
      <div
        className="mt-5"
        style={glassCardStyle}
      >
        <h1 className=" text-center mb-3">Hobbies and interest</h1>
        <ul className=" mb-0">
          <li>Pick-Up Basketball</li>
          <li>Watching Movies</li>
          <li>Working Out</li>
        </ul>
      </div>
    </div>
  );
}
