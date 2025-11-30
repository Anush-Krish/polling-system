const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet()); // Set security HTTP headers

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://polling-system-frontend-eyed.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://polling-system-frontend-eyed.onrender.com",
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '500mb' })); // Body limit increased to 500mb

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const coupleRoutes = require('./routes/coupleRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const snapRoutes = require('./routes/snapRoutes');
const chatRoutes = require('./routes/chatRoutes');
const SessionService = require('./service/SessionService'); // Import SessionService

// Use routes
app.use('/api/couples', coupleRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/snaps', snapRoutes);
app.use('/api/chat', chatRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Shunush API');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Schedule periodic cleanup of expired sessions
  setInterval(async () => {
    try {
      const result = await SessionService.cleanExpiredSessions();
      console.log(`Cleaned up ${result.deletedCount} expired sessions.`);
    } catch (error) {
      console.error('Error during expired session cleanup:', error);
    }
  }, 24 * 60 * 60 * 1000); // Run once every 24 hours
});