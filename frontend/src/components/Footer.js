import React from 'react';
import { FaBirthdayCake, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <FaBirthdayCake className="footer-logo-icon" />
              <span>Party Halls</span>
            </div>
            <p>Your perfect venue for unforgettable celebrations</p>
          </div>
          
          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-item">
              <FaPhone />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>info@partyhalls.com</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Party Street, City, State</span>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Party Halls. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 