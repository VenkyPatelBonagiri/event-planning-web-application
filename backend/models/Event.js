const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add an event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please add an event date']
    },
    time: {
        type: String,
        required: [true, 'Please add event time']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Conference', 'Workshop', 'Seminar', 'Concert', 'Sports', 'Cultural', 'Networking', 'Other']
    },
    venue: {
        type: String,
        required: [true, 'Please add venue name']
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        },
        address: {
            type: String
        }
    },
    image: {
        type: String,
        default: 'default-event.jpg'
    },
    capacity: {
        type: Number,
        default: 100
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
