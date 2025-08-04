import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaStar, FaCalendar, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './HallDetail.css';

const HallDetail = () => {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHall();
  }, [id]);

  const fetchHall = async () => {
    try {
      const response = await axios.get(`/api/halls/${id}`);
      setHall(response.data);
    } catch (error) {
      console.error('Error fetching hall:', error);
      toast.error('Failed to load hall details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading hall details...</div>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="container">
        <div className="error">
          <h2>Hall not found</h2>
          <p>The hall you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hall-detail">
        {/* Hall Images */}
        <div className="hall-images">
          {hall.images && hall.images.length > 0 ? (
            <img
              src={hall.images[0]}
              alt={hall.name}
              className="main-image"
            />
          ) : (
            <img
              src="https://via.placeholder.com/800x400?text=Party+Hall"
              alt={hall.name}
              className="main-image"
            />
          )}
        </div>

        {/* Hall Info */}
        <div className="hall-info">
          <h1 className="hall-title">{hall.name}</h1>
          
          <div className="hall-meta">
            <div className="meta-item">
              <FaMapMarkerAlt />
              <span>{hall.location}</span>
            </div>
            <div className="meta-item">
              <FaUsers />
              <span>Capacity: {hall.capacity} people</span>
            </div>
            <div className="meta-item">
              <FaStar />
              <span>Premium Venue</span>
            </div>
          </div>

          <div className="hall-price">
            <span className="price-amount">${hall.price}</span>
            <span className="price-unit">per event</span>
          </div>

          <div className="hall-description">
            <h3>Description</h3>
            <p>{hall.description}</p>
          </div>

          {hall.amenities && hall.amenities.length > 0 && (
            <div className="hall-amenities">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {hall.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <FaStar />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hall.timeSlots && hall.timeSlots.length > 0 && (
            <div className="hall-timeslots">
              <h3>Available Time Slots</h3>
              <div className="timeslots-grid">
                {hall.timeSlots.map((slot, index) => (
                  <div key={index} className="timeslot-item">
                    <FaClock />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="booking-actions">
            <Link to={`/book/${hall._id}`} className="btn btn-primary">
              <FaCalendar />
              Book This Hall
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Halls
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallDetail; 