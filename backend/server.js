const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const newsRoutes = require('./routes/news');

dotenv.config();

const authRoutes = require('./routes/auth');
const calculationRoutes = require('./routes/calculation');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api/auth', authRoutes);
app.use('/api/calculation', calculationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB Connected Successfully');
      
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      process.exit(1);
    });
}
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: err.message 
  });
});
app.use('/api/news', newsRoutes);
// Export for testing
module.exports = app;