const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/events
// @desc    Get all events with optional search and filter
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, category, dateFrom, dateTo } = req.query;
        let query = {};

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by date range
        if (dateFrom || dateTo) {
            query.date = {};
            if (dateFrom) query.date.$gte = new Date(dateFrom);
            if (dateTo) query.date.$lte = new Date(dateTo);
        }

        const events = await Event.find(query)
            .populate('createdBy', 'name email')
            .sort({ date: 1 });

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/events/stats
// @desc    Get statistics (admin only)
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRegistrations = await Registration.countDocuments();

        res.json({
            totalEvents,
            totalUsers,
            totalRegistrations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/events
// @desc    Create new event (admin only)
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('lat').notEmpty().withMessage('Latitude is required'),
    body('lng').notEmpty().withMessage('Longitude is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, date, time, category, venue, lat, lng, address, capacity } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            time,
            category,
            venue,
            location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                address
            },
            image: req.file ? req.file.filename : 'default-event.jpg',
            capacity: capacity || 100,
            createdBy: req.user._id
        });

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/events/:id
// @desc    Update event (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const { title, description, date, time, category, venue, lat, lng, address, capacity } = req.body;

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.time = time || event.time;
        event.category = category || event.category;
        event.venue = venue || event.venue;
        event.capacity = capacity || event.capacity;

        if (lat && lng) {
            event.location = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                address: address || event.location.address
            };
        }

        if (req.file) {
            event.image = req.file.filename;
        }

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Delete all registrations for this event
        await Registration.deleteMany({ event: req.params.id });

        await event.deleteOne();
        res.json({ message: 'Event removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
