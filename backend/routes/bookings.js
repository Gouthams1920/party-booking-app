const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hall = require('../models/Hall');
const { protect, admin } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      hallId,
      date,
      startTime,
      endTime,
      numberOfGuests,
      specialRequests
    } = req.body;

    // Check if hall exists
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Check if hall is available
    if (!hall.isAvailable) {
      return res.status(400).json({ message: 'Hall is not available' });
    }

    // Calculate total amount
    const totalAmount = hall.price;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        hallId: hallId,
        customerName: customerName,
        customerEmail: customerEmail
      }
    });

    // Create booking
    const booking = new Booking({
      customerName,
      customerEmail,
      customerPhone,
      hallId,
      date,
      startTime,
      endTime,
      numberOfGuests,
      totalAmount,
      specialRequests,
      stripePaymentIntentId: paymentIntent.id
    });

    const createdBooking = await booking.save();

    res.status(201).json({
      booking: createdBooking,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('hallId', 'name location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hallId', 'name location price');
    
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status || booking.status;
      booking.paymentStatus = paymentStatus || booking.paymentStatus;

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Confirm payment
// @route   POST /api/bookings/:id/confirm-payment
// @access  Public
router.post('/:id/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      booking.paymentStatus = 'completed';
      booking.paymentId = paymentIntentId;
      await booking.save();

      res.json({ 
        message: 'Payment confirmed successfully',
        booking: booking
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
