import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { createMovie, updateMovie } from '../services/api';

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

const defaultFormData = {
  title: '',
  director: '',
  year: new Date().getFullYear(),
  genre: ''
};

export default function MovieForm({ open, handleClose, movie = null, onSuccess }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form data when the dialog opens/closes or movie changes
    if (open) {
      if (movie) {
        setFormData({
          title: movie.title || '',
          director: movie.director || '',
          year: movie.year || new Date().getFullYear(),
          genre: movie.genre || ''
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [open, movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.director.trim()) return 'Director is required';
    if (!formData.year) return 'Year is required';
    if (!formData.genre) return 'Genre is required';
    
    const year = parseInt(formData.year);
    if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 5) {
      return 'Please enter a valid year (1888 or later)';
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (movie) {
        await updateMovie(movie._id, formData);
      } else {
        await createMovie(formData);
      }
      onSuccess();
      handleClose();
      // Reset form data after successful submission
      setFormData(defaultFormData);
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving movie');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setError('');
    setFormData(defaultFormData);
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{movie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Director"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            inputProps={{ 
              min: 1888,
              max: new Date().getFullYear() + 5
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            {GENRES.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (movie ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
