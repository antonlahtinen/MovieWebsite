const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authenticate = require('../middlewares/authenticate');

// Public routes (no authentication required)
router.get('/', movieController.getMovies);
router.get('/genres', movieController.getGenres);

// Protected routes (admin only)
router.post('/', authenticate(['admin']), movieController.createMovie);
router.put('/:id', authenticate(['admin']), movieController.updateMovie);
router.delete('/:id', authenticate(['admin']), movieController.deleteMovie);

module.exports = router;