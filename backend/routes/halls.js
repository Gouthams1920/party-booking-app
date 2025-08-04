const express = require('express');
const router = express.Router();
const Hall = require('../models/Hall');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all halls
// @route   GET /api/halls
// @access  Public
router.get('/', async (req, res) => {
  try {
    const halls = await Hall.find({ isAvailable: true });
    res.json(halls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single hall
// @route   GET /api/halls/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (hall) {
      res.json(hall);
    } else {
      res.status(404).json({ message: 'Hall not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a hall
// @route   POST /api/halls
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      price,
      capacity,
      images,
      amenities,
      timeSlots
    } = req.body;

    const hall = new Hall({
      name,
      description,
      location,
      price,
      capacity,
      images: images || [],
      amenities: amenities || [],
      timeSlots: timeSlots || []
    });

    const createdHall = await hall.save();
    res.status(201).json(createdHall);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a hall
// @route   PUT /api/halls/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      price,
      capacity,
      images,
      amenities,
      isAvailable,
      timeSlots
    } = req.body;

    const hall = await Hall.findById(req.params.id);

    if (hall) {
      hall.name = name || hall.name;
      hall.description = description || hall.description;
      hall.location = location || hall.location;
      hall.price = price || hall.price;
      hall.capacity = capacity || hall.capacity;
      hall.images = images || hall.images;
      hall.amenities = amenities || hall.amenities;
      hall.isAvailable = isAvailable !== undefined ? isAvailable : hall.isAvailable;
      hall.timeSlots = timeSlots || hall.timeSlots;

      const updatedHall = await hall.save();
      res.json(updatedHall);
    } else {
      res.status(404).json({ message: 'Hall not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a hall
// @route   DELETE /api/halls/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);

    if (hall) {
      await hall.remove();
      res.json({ message: 'Hall removed' });
    } else {
      res.status(404).json({ message: 'Hall not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
