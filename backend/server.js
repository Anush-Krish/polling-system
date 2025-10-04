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
    origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000", "http://localhost:3001"],
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
const coupleRoutes = require('./routes/coupleRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const snapRoutes = require('./routes/snapRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Use routes
app.use('/api/couples', coupleRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/snaps', snapRoutes);
app.use('/api/chat', chatRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Polling System API');
});

// Setup socket.io event handlers
const { setupSocketHandlers } = require('./utils/socketHandlers');
setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});