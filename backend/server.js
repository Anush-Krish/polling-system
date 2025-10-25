const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://polling-system-frontend-eyed.onrender.com",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: "https://polling-system-frontend-eyed.onrender.com",
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection successful'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const coupleRoutes = require('./routes/coupleRoutes')(io);
const sessionRoutes = require('./routes/sessionRoutes');
const snapRoutes = require('./routes/snapRoutes')(io);
const chatRoutes = require('./routes/chatRoutes')(io);
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