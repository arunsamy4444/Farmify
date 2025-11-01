import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link 
          to="/home" 
          className="navbar-logo"
          onClick={closeMenu}
        >
          FarmiFy
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="navbar-toggle-bar"></span>
          <span className="navbar-toggle-bar"></span>
          <span className="navbar-toggle-bar"></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/admin-dashboard" 
            className="navbar-link navbar-link-admin"
            onClick={closeMenu}
          >
            Admin Dashboard
          </Link>
          <Link 
            to="/buyer-dashboard" 
            className="navbar-link navbar-link-buyer"
            onClick={closeMenu}
          >
            Buyer Dashboard
          </Link>
        </div>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div 
            className="navbar-overlay"
            onClick={closeMenu}
          ></div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;