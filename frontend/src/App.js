import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import HallDetail from './pages/HallDetail';
import BookingForm from './pages/BookingForm';
import BookingSuccess from './pages/BookingSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hall/:id" element={<HallDetail />} />
            <Route path="/book/:hallId" element={<BookingForm />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Elements>
      </main>
      <Footer />
    </div>
  );
}

export default App;
