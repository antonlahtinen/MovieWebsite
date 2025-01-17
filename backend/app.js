require('dotenv').config(); // Load environment variables
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/database');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: ['http://localhost', 'http://localhost:80', 'http://localhost:3000'], // Allow requests from frontend
  credentials: true
}));

// Routes
app.get('/', (req, res) => res.send("Welcome to the Movie API!"));
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);
app.use('/auth', userRoutes);  // Add user routes under /auth endpoint

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something broke!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});