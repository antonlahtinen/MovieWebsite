const mongoose = require('mongoose');

const GENRES = [
    'Action',
    'Adventure',
    'Comedy',
    'Crime',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Western',
    'Documentary'
];

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    year: {
        type: Number,
        required: true,
        min: 1888,
        max: new Date().getFullYear() + 5,
    },
    genre: { 
        type: String, 
        required: true,
        enum: GENRES 
    }
});

module.exports = mongoose.model('Movie', movieSchema);