import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <header className="header_section">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg custom_nav-container">
          <Link to="/" className="navbar-brand">
            <span>FinTrack</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
          >
            <span className=""></span>
          </button>
          <div
            className={`collapse navbar-collapse ${
              isCollapsed ? "" : "show"
            }`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/features" className="nav-link">
                  Features
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <i className="fa fa-user" aria-hidden="true" /> Login
                </Link>
              </li>
            </ul>
            <form className="form-inline">
              <button
                className="btn my-2 my-sm-0 nav_search-btn"
                type="submit"
              >
                <i className="fa fa-search" aria-hidden="true" />
              </button>
            </form>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
