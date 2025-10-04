# Flixy

A MERN stack application for couples to share daily updates, snaps, and messages with each other.

## Project Structure

This project follows the MERN stack architecture with a clear separation between the frontend and backend:

```
polling-system/
├── backend/
│   ├── controllers/    # Request handlers
│   ├── dto/           # Data transfer objects
│   ├── entity/        # Database models
│   ├── service/       # Business logic
│   ├── repository/    # Database operations
│   ├── routes/        # API route definitions
│   ├── middleware/    # Express middleware
│   ├── config/        # Configuration files
│   └── utils/         # Utility functions (including R2 integration)
├── frontend/
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/ # Reusable UI components (CoupleAuth, StatusUpdate, SnapSharing, ChatUI, etc.)
│   │   ├── pages/     # Route-level components (DashboardPage)
│   │   ├── hooks/     # Custom React hooks
│   │   ├── context/   # Global state context
│   │   ├── services/  # API service functions
│   │   ├── utils/     # Utility functions
│   │   ├── styles/    # CSS and styling
│   │   └── assets/    # Images and other assets
│   ├── package.json
│   └── vite.config.js
├── package.json       # Root package.json with scripts
└── README.md
```

## Features

- Secure couple authentication using access codes
- Daily status updates with location tagging
- Snap sharing (up to 6 snaps per day) with camera integration
- Real-time messaging with chat history
- Location sharing for both partners
- Preview and capture functionality for snaps
- Secure JWT-based authentication
- Cloudflare R2 integration for image storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (either locally or use MongoDB Atlas)
- Cloudflare R2 account for image storage

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd polling-system
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   npm run install-all
   ```

### Running the Application

To run both the backend and frontend concurrently:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5001

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
R2_ENDPOINT=https://396e002de9ba2adacec4dcb72f7c96c2.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
PORT=5001
```

## Backend Structure (Node.js/Express/MongoDB)

### Controllers
Handle HTTP requests and responses. Should be thin and delegate business logic to services.

### DTOs (Data Transfer Objects)
Define data structures for API requests/responses and validate input data.

### Entities
Represent database models and define schema and relationships.

### Services
Contain business logic and handle complex operations.

### Repositories
Handle database operations and abstract database access logic.

## Frontend Structure (React/Vite)

### Components
Reusable UI elements that are primarily presentational.

### Pages
Route-level components that handle page-specific logic.

### Hooks
Custom React hooks to extract component logic.

### Context
Global state management for application-wide state.

### Services
API calls and HTTP request logic.

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing
- AWS SDK for R2 integration

### Frontend
- React (with JavaScript)
- Vite as build tool
- CSS for styling
- React Router for navigation
- Native browser APIs for camera and location access

## API Standards

- RESTful API design
- Secure JWT token-based authentication
- Consistent response format
- Proper HTTP status codes
- Input validation
- Error handling

## Troubleshooting

### Camera Access
- Ensure the application is served over HTTPS (or localhost) for camera access to work
- Check browser permissions for camera and location access

### Database Connection
- Make sure MongoDB is running before starting the application
- Check the MONGODB_URI in your .env file matches your MongoDB installation or Atlas connection string

### R2 Storage
- Verify your R2 credentials in the environment variables
- Ensure the bucket 'anush-dev' exists in your R2 account