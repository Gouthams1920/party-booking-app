import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaUsers, FaCalendar, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('halls');
  const [showAddHall, setShowAddHall] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    capacity: '',
    amenities: '',
    images: ''
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [hallsRes, bookingsRes] = await Promise.all([
        axios.get('/api/halls', config),
        axios.get('/api/bookings', config)
      ]);

      setHalls(hallsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitHall = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const hallData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        amenities: formData.amenities.split(',').map(item => item.trim()),
        images: formData.images.split(',').map(item => item.trim())
      };

      if (editingHall) {
        await axios.put(`/api/halls/${editingHall._id}`, hallData, config);
        toast.success('Hall updated successfully!');
      } else {
        await axios.post('/api/halls', hallData, config);
        toast.success('Hall added successfully!');
      }

      setShowAddHall(false);
      setEditingHall(null);
      setFormData({
        name: '',
        description: '',
        location: '',
        price: '',
        capacity: '',
        amenities: '',
        images: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving hall:', error);
      toast.error('Failed to save hall');
    }
  };

  const handleEditHall = (hall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      description: hall.description,
      location: hall.location,
      price: hall.price.toString(),
      capacity: hall.capacity.toString(),
      amenities: hall.amenities?.join(', ') || '',
      images: hall.images?.join(', ') || ''
    });
    setShowAddHall(true);
  };

  const handleDeleteHall = async (hallId) => {
    if (window.confirm('Are you sure you want to delete this hall?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        await axios.delete(`/api/halls/${hallId}`, config);
        toast.success('Hall deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting hall:', error);
        toast.error('Failed to delete hall');
      }
    }
  };

  const getStats = () => {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalHalls = halls.length;
    
    return { totalBookings, totalRevenue, totalHalls };
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendar />
          </div>
          <div className="stat-number">{stats.totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-number">${stats.totalRevenue}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-number">{stats.totalHalls}</div>
          <div className="stat-label">Total Halls</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'halls' ? 'active' : ''}`}
          onClick={() => setActiveTab('halls')}
        >
          Manage Halls
        </button>
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          View Bookings
        </button>
      </div>

      {activeTab === 'halls' && (
        <div className="halls-section">
          <div className="section-header">
            <h2>Party Halls</h2>
            <button
              onClick={() => setShowAddHall(true)}
              className="btn btn-primary"
            >
              <FaPlus />
              Add New Hall
            </button>
          </div>

          {showAddHall && (
            <div className="add-hall-form">
              <h3>{editingHall ? 'Edit Hall' : 'Add New Hall'}</h3>
              <form onSubmit={handleSubmitHall}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hall Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="WiFi, Parking, Catering"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    name="images"
                    value={formData.images}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingHall ? 'Update Hall' : 'Add Hall'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddHall(false);
                      setEditingHall(null);
                      setFormData({
                        name: '',
                        description: '',
                        location: '',
                        price: '',
                        capacity: '',
                        amenities: '',
                        images: ''
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="halls-grid">
            {halls.map((hall) => (
              <div key={hall._id} className="hall-card">
                <img
                  src={hall.images && hall.images[0] ? hall.images[0] : 'https://via.placeholder.com/300x200?text=Party+Hall'}
                  alt={hall.name}
                  className="hall-image"
                />
                <div className="hall-content">
                  <h3>{hall.name}</h3>
                  <p>{hall.location}</p>
                  <p>Price: ${hall.price}</p>
                  <p>Capacity: {hall.capacity} people</p>
                  <div className="hall-actions">
                    <button
                      onClick={() => handleEditHall(hall)}
                      className="btn btn-secondary"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteHall(hall._id)}
                      className="btn btn-danger"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-section">
          <h2>Recent Bookings</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking #</th>
                  <th>Customer</th>
                  <th>Hall</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.bookingNumber}</td>
                    <td>{booking.customerName}</td>
                    <td>{booking.hallId?.name || 'N/A'}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>${booking.totalAmount}</td>
                    <td>
                      <span className={`status-${booking.paymentStatus}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 