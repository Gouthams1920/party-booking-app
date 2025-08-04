import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await axios.get('/api/halls');
      setHalls(response.data);
    } catch (error) {
      console.error('Error fetching halls:', error);
      toast.error('Failed to load halls');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading halls...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Your Perfect Party Venue</h1>
          <p>Book beautiful halls for your special celebrations</p>
          <Link to="#halls" className="btn btn-primary">
            View Available Halls
          </Link>
        </div>
      </section>

      {/* Halls Section */}
      <section id="halls" className="section">
        <div className="container">
          <h2 className="section-title">Available Party Halls</h2>
          
          {halls.length === 0 ? (
            <div className="no-halls">
              <p>No halls available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {halls.map((hall) => (
                <div key={hall._id} className="hall-card">
                  <img
                    src={hall.images && hall.images[0] ? hall.images[0] : 'https://via.placeholder.com/400x200?text=Party+Hall'}
                    alt={hall.name}
                    className="hall-image"
                  />
                  <div className="hall-content">
                    <h3 className="hall-title">{hall.name}</h3>
                    <p className="hall-location">
                      <FaMapMarkerAlt />
                      {hall.location}
                    </p>
                    <p className="hall-price">${hall.price}/event</p>
                    <p className="hall-capacity">
                      <FaUsers />
                      Capacity: {hall.capacity} people
                    </p>
                    {hall.amenities && hall.amenities.length > 0 && (
                      <div className="hall-amenities">
                        {hall.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link to={`/hall/${hall._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">Why Choose Our Party Halls?</h2>
          <div className="grid grid-cols-3">
            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Premium Venues</h3>
              <p>Beautiful, well-maintained halls perfect for any celebration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Flexible Capacity</h3>
              <p>Halls available for intimate gatherings to large parties</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Prime Locations</h3>
              <p>Conveniently located venues across the city</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 