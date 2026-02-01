const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// [IMPORTANT] Import the Controller we created
const { 
  getProjects, 
  purchaseOffset, 
  getMyPurchases,
  getOffsetForCalculation 
} = require('../controllers/OffsetControllers');

// @route   GET /api/offset/projects
// @desc    Get all active offset projects
// @access  Public
router.get('/projects', getProjects);

// @route   POST /api/offset/purchase
// @desc    Purchase carbon offset (Includes Real-time & Email logic)
// @access  Private
router.post('/purchase', protect, purchaseOffset);

// @route   GET /api/offset/my-purchases
// @desc    Get user's offset purchases
// @access  Private
router.get('/my-purchases', protect, getMyPurchases);

// @route   GET /api/offset/calculate
// @desc    Calculate offset needed based on footprint
// @access  Private
router.get('/calculate', protect, getOffsetForCalculation);

module.exports = router;