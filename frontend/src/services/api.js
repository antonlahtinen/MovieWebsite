import axios from 'axios';

// Get the base URL based on environment
const API_URL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path (nginx will proxy)
  : 'http://localhost:3000'; // In development, use direct URL

// Create axios instance with custom config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    console.log('Current token:', localStorage.getItem('token'));

    // Public endpoints that don't need authentication
    const publicEndpoints = [
      { path: '/movies', method: 'get' },
      { path: '/movies/genres', method: 'get' },
      { path: '/auth/login', method: 'post' },
      { path: '/auth/register', method: 'post' }
    ];

    // Check if the request is for a public endpoint
    const isPublic = publicEndpoints.some(endpoint => 
      config.url === endpoint.path && 
      (!endpoint.method || config.method === endpoint.method)
    );

    // Also consider movie search/filter requests as public
    const isPublicMovieRequest = config.url.startsWith('/movies') && config.method === 'get';

    console.log('Is public endpoint:', isPublic);
    console.log('Is public movie request:', isPublicMovieRequest);

    if (isPublic || isPublicMovieRequest) {
      return config;
    }
    
    // Add token for authenticated endpoints
    const token = localStorage.getItem('token');
    console.log('Token for auth:', token);

    if (!token) {
      console.error('No authentication token found');
      return Promise.reject(new Error('No authentication token found'));
    }

    config.headers.Authorization = `Bearer ${token}`;
    console.log('Final headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject({
        response: {
          data: {
            error: error.response.data.error || 'An error occurred'
          }
        }
      });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        response: {
          data: {
            error: 'No response received from server'
          }
        }
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        response: {
          data: {
            error: error.message
          }
        }
      });
    }
  }
);

export const login = async (credentials) => {
  console.log('Login request with:', credentials);
  const response = await api.post('/auth/login', credentials);
  console.log('Login response:', response.data);
  
  // Save token to localStorage
  localStorage.setItem('token', response.data.token);
  console.log('Token saved:', response.data.token);
  
  return {
    token: response.data.token,
    user: {
      username: credentials.username,
      role: response.data.user?.role || 'regular'
    }
  };
};

export const register = async (userData) => {
  console.log('Register request with:', userData);
  const response = await api.post('/auth/register', userData);
  console.log('Register response:', response.data);
  
  // Save token to localStorage
  localStorage.setItem('token', response.data.token);
  console.log('Token saved:', response.data.token);
  
  return {
    message: response.data.message,
    token: response.data.token,
    user: {
      username: userData.username,
      role: response.data.user?.role || 'regular'
    }
  };
};

export const getAllMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const getMovie = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await api.post('/movies', movieData);
  return response.data;
};

export const updateMovie = async (id, movieData) => {
  const response = await api.put(`/movies/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/movies/${id}`);
  return response.data;
};

// Movie endpoints
export const getMovies = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.genre) params.append('genre', filters.genre);
  if (filters.year) params.append('year', filters.year);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  
  const response = await api.get(`/movies?${params.toString()}`);
  return response.data;
};

export const getGenres = async () => {
  const response = await api.get('/movies/genres');
  return response.data;
};
