import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCalendar, FaClock, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './BookingForm.css';

const BookingForm = () => {
  const { hallId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    startTime: '',
    endTime: '',
    numberOfGuests: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetchHall();
  }, [hallId]);

  const fetchHall = async () => {
    try {
      const response = await axios.get(`/api/halls/${hallId}`);
      setHall(response.data);
    } catch (error) {
      console.error('Error fetching hall:', error);
      toast.error('Failed to load hall details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create booking and get payment intent
      const bookingResponse = await axios.post('/api/bookings', {
        ...formData,
        hallId
      });

      const { clientSecret } = bookingResponse.data;

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.customerName,
            email: formData.customerEmail
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await axios.post(`/api/bookings/${bookingResponse.data.booking._id}/confirm-payment`, {
          paymentIntentId: paymentIntent.id
        });

        toast.success('Booking successful! Payment completed.');
        navigate('/booking-success', { 
          state: { 
            booking: bookingResponse.data.booking,
            hall: hall 
          } 
        });
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error('Failed to process booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading booking form...</div>
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="container">
        <div className="error">
          <h2>Hall not found</h2>
          <p>The hall you're trying to book doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="booking-container">
        <div className="booking-form">
          <h1>Book Your Party Hall</h1>
          <p className="booking-subtitle">Complete your booking for {hall.name}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaUser />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaEnvelope />
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FaPhone />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Event Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaCalendar />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaClock />
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    min="1"
                    max={hall.capacity}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Any special requirements or requests..."
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Information</h3>
              <div className="payment-summary">
                <div className="summary-item">
                  <span>Hall:</span>
                  <span>{hall.name}</span>
                </div>
                <div className="summary-item">
                  <span>Price:</span>
                  <span>${hall.price}</span>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>${hall.price}</span>
                </div>
              </div>
              <div className="card-element-container">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || processing}
              className="btn btn-primary btn-large"
            >
              {processing ? 'Processing...' : `Pay $${hall.price} & Book`}
            </button>
          </form>
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-card">
            <img
              src={hall.images && hall.images[0] ? hall.images[0] : 'https://via.placeholder.com/300x200?text=Party+Hall'}
              alt={hall.name}
              className="summary-image"
            />
            <div className="summary-content">
              <h4>{hall.name}</h4>
              <p>{hall.location}</p>
              <p>Capacity: {hall.capacity} people</p>
              <p className="summary-price">${hall.price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm; 