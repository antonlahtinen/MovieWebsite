import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import MovieList from './components/MovieList';
import UserSettings from './components/UserSettings';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/movies" replace /> : children;
};

function AppContent() {
  const { user, logout: handleLogout } = useAuth();

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/movies" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          >
            MOVIE APP
          </Typography>
          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>
                Welcome, {user.username}
              </Typography>
              <Button color="inherit" component={Link} to="/movies">
                Movies
              </Button>
              <Button color="inherit" component={Link} to="/settings">
                Settings
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <PrivateRoute>
              <MovieList />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <UserSettings />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
