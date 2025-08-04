import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaCalendar, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const location = useLocation();
  const { booking, hall } = location.state || {};

  if (!booking || !hall) {
    return (
      <div className="container">
        <div className="error">
          <h2>Booking information not found</h2>
          <p>Please return to the home page and try again.</p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="success-container">
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1>Booking Confirmed!</h1>
          <p>Your party hall has been successfully booked. You will receive a confirmation email shortly.</p>
        </div>

        <div className="booking-details">
          <h2>Booking Details</h2>
          
          <div className="details-grid">
            <div className="detail-card">
              <h3>Booking Information</h3>
              <div className="detail-item">
                <span>Booking Number:</span>
                <span className="booking-number">{booking.bookingNumber}</span>
              </div>
              <div className="detail-item">
                <span>Customer:</span>
                <span>{booking.customerName}</span>
              </div>
              <div className="detail-item">
                <span>Email:</span>
                <span>{booking.customerEmail}</span>
              </div>
              <div className="detail-item">
                <span>Phone:</span>
                <span>{booking.customerPhone}</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Event Details</h3>
              <div className="detail-item">
                <span>Hall:</span>
                <span>{hall.name}</span>
              </div>
              <div className="detail-item">
                <span>Date:</span>
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span>Time:</span>
                <span>{booking.startTime} - {booking.endTime}</span>
              </div>
              <div className="detail-item">
                <span>Guests:</span>
                <span>{booking.numberOfGuests} people</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Payment Information</h3>
              <div className="detail-item">
                <span>Amount Paid:</span>
                <span className="amount">${booking.totalAmount}</span>
              </div>
              <div className="detail-item">
                <span>Payment Status:</span>
                <span className="status-success">Completed</span>
              </div>
              <div className="detail-item">
                <span>Payment ID:</span>
                <span className="payment-id">{booking.paymentId}</span>
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="special-requests">
              <h3>Special Requests</h3>
              <p>{booking.specialRequests}</p>
            </div>
          )}
        </div>

        <div className="hall-summary">
          <h3>Hall Information</h3>
          <div className="hall-card">
            <img
              src={hall.images && hall.images[0] ? hall.images[0] : 'https://via.placeholder.com/300x200?text=Party+Hall'}
              alt={hall.name}
              className="hall-image"
            />
            <div className="hall-info">
              <h4>{hall.name}</h4>
              <p><FaMapMarkerAlt /> {hall.location}</p>
              <p><FaUsers /> Capacity: {hall.capacity} people</p>
              <p><FaClock /> Price: ${hall.price}/event</p>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Confirmation Email</h4>
              <p>You'll receive a detailed confirmation email with all booking details.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Contact Venue</h4>
              <p>Our team will contact you within 24 hours to discuss any special arrangements.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Enjoy Your Event</h4>
              <p>Arrive on your scheduled date and time for your perfect celebration!</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn btn-primary">
            Book Another Hall
          </Link>
          <button 
            onClick={() => window.print()} 
            className="btn btn-secondary"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess; 