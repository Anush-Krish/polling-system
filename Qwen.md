# Flixy - MERN Stack Project Standards

## Project Structure

```
polling-system/
├── backend/
│   ├── controllers/
│   ├── dto/
│   ├── entity/
│   ├── service/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   │   ├── r2Config.js
│   │   └── r2Upload.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CoupleAuth.jsx
│   │   │   ├── CoupleAuth.css
│   │   │   ├── StatusUpdate.jsx
│   │   │   ├── StatusUpdate.css
│   │   │   ├── SnapSharing.jsx
│   │   │   ├── SnapSharing.css
│   │   │   ├── ChatUI.jsx
│   │   │   ├── ChatUI.css
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── ChatBubble.css
│   │   │   ├── LocationDisplay.jsx
│   │   │   └── LocationDisplay.css
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── DashboardPage.css
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## Backend Structure (Node.js/Express/MongoDB)

### Entities
- Couple: Represents a couple with name, partners, access code, and status
- Session: Manages user sessions with JWT tokens
- Snap: Stores shared images with metadata
- ChatMessage: Handles couple messaging

### DTOs (Data Transfer Objects)
- CoupleDTO: Validates couple creation and updates
- SessionDTO: Validates session data
- SnapDTO: Validates snap uploads
- ChatMessageDTO: Validates chat messages

### Services
- CoupleService: Handles couple creation, authentication, and status updates
- SessionService: Manages JWT token creation and verification
- SnapService: Handles snap uploads, storage, and retrieval
- ChatService: Manages messaging between partners

### Controllers
- CoupleController: Handles couple endpoints
- SessionController: Manages session endpoints
- SnapController: Handles snap endpoints
- ChatController: Manages chat endpoints

### Middleware
- authMiddleware: Verifies JWT tokens for protected routes

### Utils
- r2Config.js: Configures Cloudflare R2 client
- r2Upload.js: Handles image uploads to R2 storage

## Frontend Structure (React/Vite)

### Components
- CoupleAuth: Handles couple authentication with access codes
- StatusUpdate: Allows daily status updates with location
- SnapSharing: Manages snap sharing with camera integration
- ChatUI: Provides messaging interface
- ChatBubble: Floating chat button that opens chat modal
- LocationDisplay: Shows partner location
- Located in `src/components/`

### Pages
- DashboardPage: Main application page that combines all features
- Located in `src/pages/`

### Services
- API service functions in main components for backend communication

### Styles
- Component-specific CSS files for modular styling
- Located in component directories

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing
- AWS SDK for R2 integration
- Socket.io for real-time features

### Frontend
- React (with JavaScript)
- Vite as build tool
- CSS for styling
- React Router for navigation
- Native browser APIs for camera and location access

## Security Features

- JWT-based authentication
- Secure access code system for couples
- Cloudflare R2 for secure image storage
- Session management with automatic expiration

## API Standards

- RESTful API design
- Secure JWT token-based authentication
- Consistent response format
- Proper HTTP status codes
- Input validation
- Error handling

## Special Features

- Camera integration for snap capture
- Location access for geotagging
- Image upload to Cloudflare R2
- Real-time messaging
- Responsive design
- Modal-based chat interface