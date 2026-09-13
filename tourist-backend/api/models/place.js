const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    address: String,
    image: String,
    description: String,
    placeCreatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Place = mongoose.model('place', placeSchema);

module.exports = Place;
