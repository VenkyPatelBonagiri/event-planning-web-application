const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/registrations
// @desc    Register for an event
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            user: req.user._id,
            event: eventId
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // Create registration
        const registration = await Registration.create({
            user: req.user._id,
            event: eventId
        });

        const populatedRegistration = await Registration.findById(registration._id)
            .populate('event')
            .populate('user', 'name email');

        res.status(201).json(populatedRegistration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/registrations/user
// @desc    Get current user's registrations
// @access  Private
router.get('/user', protect, async (req, res) => {
    try {
        const registrations = await Registration.find({ user: req.user._id })
            .populate('event')
            .sort({ registeredAt: -1 });

        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get all registrations for an event (admin only)
// @access  Private/Admin
router.get('/event/:eventId', protect, admin, async (req, res) => {
    try {
        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('user', 'name email phone')
            .sort({ registeredAt: -1 });

        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/registrations/:id
// @desc    Cancel registration
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Check if user owns this registration or is admin
        if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this registration' });
        }

        await registration.deleteOne();
        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/registrations/check/:eventId
// @desc    Check if user is registered for an event
// @access  Private
router.get('/check/:eventId', protect, async (req, res) => {
    try {
        const registration = await Registration.findOne({
            user: req.user._id,
            event: req.params.eventId
        });

        res.json({ isRegistered: !!registration, registration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
