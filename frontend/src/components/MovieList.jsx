import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Fab,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { getMovies, deleteMovie } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieForm from './MovieForm';
import SearchBar from './SearchBar';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, movieId: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadMovies();
  }, [filters]); // Reload when filters change

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await getMovies(filters);
      setMovies(data);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error loading movies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMovie(id);
      loadMovies();
      showAlert('Movie deleted successfully', 'success');
      setDeleteDialog({ open: false, movieId: null });
    } catch (error) {
      showAlert(error.response?.data?.error || 'Error deleting movie', 'error');
    }
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setSelectedMovie(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedMovie(null);
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleDeleteClick = (movieId) => {
    setDeleteDialog({ open: true, movieId });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, movieId: null });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <SearchBar onSearch={handleSearch} />
      
      {isAdmin && (
        <Box sx={{ mb: 3 }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              setSelectedMovie(null);
              setOpenForm(true);
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" m={4}>
          <CircularProgress />
        </Box>
      ) : movies.length === 0 ? (
        <Alert severity="info">No movies found</Alert>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item key={movie._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {movie.title}
                  </Typography>
                  <Typography>
                    Director: {movie.director}
                  </Typography>
                  <Typography>
                    Year: {movie.year}
                  </Typography>
                  <Typography>
                    Genre: {movie.genre}
                  </Typography>
                </CardContent>
                {isAdmin && (
                  <CardActions>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEdit(movie)}
                      aria-label="edit movie"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(movie._id)}
                      aria-label="delete movie"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <MovieForm
        open={openForm}
        handleClose={handleCloseForm}
        movie={selectedMovie}
        onSuccess={() => {
          loadMovies();
          showAlert(selectedMovie ? 'Movie updated successfully' : 'Movie created successfully', 'success');
        }}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this movie?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={() => handleDelete(deleteDialog.movieId)} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
