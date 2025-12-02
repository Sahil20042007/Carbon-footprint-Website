const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const compression = require('compression');
const newsRoutes = require('./routes/news');
const recommendationsRoutes = require('./routes/recommendations');
const offsetRoutes = require('./routes/offset');
const commentsRoutes = require('./routes/comments');

dotenv.config();

const authRoutes = require('./routes/auth');
const calculationRoutes = require('./routes/calculation');


const app = express();

// Security: Helmet
app.use(helmet());

// Security: CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// Security: Rate Limiting
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

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security: MongoDB sanitization
app.use(mongoSanitize());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'EcoTrack Carbon Footprint API is running!',
    status: 'active'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working!',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      calculation: '/api/calculation'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Apply auth rate limiter
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/calculation', calculationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/offset', offsetRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/comments', commentsRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});




// Start server
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB Connected Successfully');
      
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      process.exit(1);
    });
}

module.exports = app;