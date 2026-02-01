const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http'); 
const { Server } = require('socket.io'); 

// Route Imports
const newsRoutes = require('./routes/news');
const recommendationsRoutes = require('./routes/recommendations');
const offsetRoutes = require('./routes/offset');
const commentsRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');
const calculationRoutes = require('./routes/routesCalculation');

dotenv.config();

const app = express();
const server = http.createServer(app);

// =========================================================
// 1. CORS CONFIGURATION (MUST BE AT THE TOP)
// =========================================================

const allowedOrigins = [
  'https://carbon-footprint-website-chi.vercel.app', // Your Vercel Frontend
  'http://localhost:3000'                            // Local Development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Debug log
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // 👈 FIX: Solves some legacy browser/proxy errors
};

// Apply CORS before any other security middleware
app.use(cors(corsOptions));

// ⭐️ CRITICAL FIX: Handle Preflight Requests specifically
app.options('*', cors(corsOptions)); 

// =========================================================
// 2. SECURITY & MIDDLEWARE
// =========================================================

// Security: Helmet
app.use(helmet());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`⚡ New Real-time Connection: ${socket.id}`);
  
  socket.on('join_room', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from real-time socket');
  });
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, try again after 15 minutes.'
});

// Parsing & Sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// =========================================================
// 3. ROUTES
// =========================================================

app.get('/', (req, res) => {
  res.json({ message: 'EcoTrack Carbon Footprint API is running!', status: 'active' });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working!',
    endpoints: { auth: '/api/auth/login, /api/auth/register', calculation: '/api/calculation' }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/calculation', calculationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/offset', offsetRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/comments', commentsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// =========================================================
// 4. SERVER START
// =========================================================

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB Connected Successfully');
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`⚡ Socket.io initialized and ready`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      process.exit(1);
    });
}

module.exports = app;