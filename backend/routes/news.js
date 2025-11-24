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
    
    res.status(200).json({
      success: true,
      count: news.length,
      data: news
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