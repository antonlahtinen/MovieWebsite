const Movie = require('../models/Movie');
const Joi = require('joi');

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

// Joi validation schema
const movieSchema = Joi.object({
    title: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    year: Joi.number()
        .integer()
        .min(1888)
        .max(new Date().getFullYear() + 5)
        .required(),
    genre: Joi.string()
        .valid(...GENRES)
        .required()
});

// Controller functions
exports.getMovies = async (req, res) => {
    try {
        const { search, genre, year, sortBy } = req.query;
        let query = {};

        // Search by title or director
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { director: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by genre
        if (genre) {
            query.genre = genre;
        }

        // Filter by year
        if (year) {
            query.year = parseInt(year);
        }

        // Build sort object
        let sort = {};
        switch (sortBy) {
            case 'titleAsc':
                sort = { title: 1 };
                break;
            case 'titleDesc':
                sort = { title: -1 };
                break;
            case 'yearAsc':
                sort = { year: 1 };
                break;
            case 'yearDesc':
                sort = { year: -1 };
                break;
            default:
                sort = { title: 1 };
        }

        const movies = await Movie.find(query).sort(sort);
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

exports.getGenres = (req, res) => {
    res.json(GENRES);
};

exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie' });
    }
};

exports.createMovie = async (req, res) => {
    // Validate input with Joi
    const { error } = movieSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const movie = new Movie(req.body);
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        console.error('Create movie error:', err);
        res.status(500).json({ error: err.message || 'Failed to create movie' });
    }
};

exports.updateMovie = async (req, res) => {
    // Validate input with Joi
    const { error } = movieSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        console.error('Update movie error:', err);
        res.status(500).json({ error: err.message || 'Failed to update movie' });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete movie' });
    }
};