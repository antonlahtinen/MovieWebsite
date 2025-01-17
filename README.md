# Movie App

A modern full-stack web application for managing movies, built with the MERN stack (MongoDB, Express, React, Node.js) and containerized with Docker.

## Features

### User Management
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/Regular users)
- User settings page for password changes

### Movie Management
- Browse movie collection
- Advanced search functionality:
  - Search by title or director
  - Filter by genre
  - Filter by year
  - Sort by title or year (ascending/descending)
- Add, edit, and delete movies (admin only)
- Movie details including title, director, year, and genre

### User Interface
- Modern, responsive design using Material-UI
- Intuitive navigation
- Real-time search and filtering
- Clean and professional look
- Success/error notifications for better user feedback

## Technologies

### Frontend
- React
- Material-UI for styling
- React Router for navigation
- Axios for API calls
- Vite for build tooling

### Backend
- Node.js with Express
- MongoDB Atlas for database
- JWT for authentication
- Joi for validation
- Morgan for request logging
- CORS for cross-origin resource sharing

### DevOps
- Docker and Docker Compose for containerization

## Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Installation Steps

1. Clone the repository:
```bash
git clone [your-repository-url]
cd MovieApp
```

2. Set up your environment variables in `backend/.env`:
```
MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/movieapp
JWT_SECRET=your_secure_jwt_secret_here
PORT=3000
```

3. Build and start containers:
```bash
docker compose up -d
```

4. Access the application:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000

### Docker Commands

Common commands for managing the application:

```bash
# Start the application
docker compose up -d

# View logs
docker compose logs

# Stop the application
docker compose down

# Rebuild containers
docker compose up -d --build

# Remove all containers and volumes
docker compose down -v
```

## API Endpoints

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - User login
- `POST /auth/change-password` - Change user password (requires auth)

### Movies
- `GET /movies` - List all movies
  - Query parameters:
    - `search`: Search in title and director
    - `genre`: Filter by genre
    - `year`: Filter by year
    - `sortBy`: Sort by title or year (titleAsc, titleDesc, yearAsc, yearDesc)
- `POST /movies` - Add new movie (admin only)
- `PUT /movies/:id` - Update movie (admin only)
- `DELETE /movies/:id` - Delete movie (admin only)

## Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected API endpoints
- Secure password change functionality
- CORS protection
