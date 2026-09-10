const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique:true,
        dropDups: true
    },
    address: String,
    image: String,
    description: String,
    placeCreatedAt:{
        type: Date,
        default: Date.now()
    }
})

const Place = mongoose.model('place',PlaceSchema)

module.exports = Place;
