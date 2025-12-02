const express = require('express');
const router = express.Router();
const { fetchClimateNews } = require('../services/newsService');

// @route   GET /api/news
// @desc    Get latest climate news
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📰 Fetching climate news...');
    
    const news = await fetchClimateNews();
    
    // Disable caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
      timestamp: new Date().toISOString() // Add timestamp
    });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
});

module.exports = router;