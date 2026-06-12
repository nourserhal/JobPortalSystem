import { Link } from "react-router-dom";
import React from "react";
import "../../styles/home.css";

function Navbar() {
    return (
        <nav className="home-navbar">
            <div className="home-nav-content">
                <a href="#home" className="home-logo">
                    <span className="home-logo-icon">💼</span>
                    <span>JobPortal</span>
                </a>

                <div className="home-nav-links">
                    <a href="#jobs">Jobs</a>
                    <a href="#roles">Roles</a>
                    <a href="#about">About</a>
                    <a href="#contact">Contact</a>
                </div>

                <div className="home-nav-actions">
                    <Link className="home-main-btn small" to="/roles">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;