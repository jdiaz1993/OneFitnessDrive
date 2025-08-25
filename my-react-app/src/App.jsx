import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Home";
import About from "./About"; // Make sure About.jsx exists
import Plans from "./Plans";
import Footer from "./components/Footer";
import Contact from "./Contact";
import SplashVideo from "./SplashVideo";


export default function App() {
  return (
    <Router>
       <div className="bg-fixed" 
        style={{ backgroundImage: 'url(/dannylogo3.jpg)' }}
       aria-hidden="true" />

      <Navbar /> {/* Navbar will handle navigation links */}

        <Routes>
          <Route path="/" element={<SplashVideo />} /> {/* Splash video page */}
          <Route path="/home" element={<Home />} />      {/* Home page */}
          <Route path="/about" element={<About />} /> {/* About page */}
          <Route path="/plans" element={<Plans />} /> {/* Plans page */}
          <Route path="/contact" element={<Contact />} /> {/* Contact page */}
          
        </Routes>
      <Footer /> {/* Footer will be displayed on all pages */}
    </Router>
  );
}