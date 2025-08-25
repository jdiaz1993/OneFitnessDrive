import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


import navbarLogo from "../navOnedrive.png"; // Ensure the correct path to your logo

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const { pathname } = useLocation();

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  // Close when clicking outside + on Esc
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") return close();
      if (navRef.current && !navRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, []);

  // Close after route change
  useEffect(() => { close(); }, [pathname]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark stickynavbar navbar-expand-lg navbar-dark bg-dark sticky-top custom-nav py-0-top custom-nav" ref={navRef}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={navbarLogo}
            alt="One Drive Fitness"
            style={{ height: "100px", width: "auto", display: "block" }}
          />
        </Link>

        <button
          className="navbar-toggler ms-auto"
          type="button"
          onClick={toggle}
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="navbarNav" className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto text-white">
            <li className="nav-item"><Link className="nav-link" to="/home" onClick={close}>Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about" onClick={close}>About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/plans" onClick={close}>Plans</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact" onClick={close}>Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
