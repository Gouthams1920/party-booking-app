import React from 'react';
import { Link } from 'react-router-dom';
import { FaBirthdayCake, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FaBirthdayCake className="logo-icon" />
            <span>Party Halls</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/admin" className="nav-link admin-link">
              <FaUser />
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 