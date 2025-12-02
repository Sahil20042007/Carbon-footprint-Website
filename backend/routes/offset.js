const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const OffsetProject = require('../models/OffsetProject');
const OffsetPurchase = require('../models/OffsetPurchase');
const Calculation = require('../models/sahilcalculator');

// @route   GET /api/offset/projects
// @desc    Get all active offset projects
// @access  Public
router.get('/projects', async (req, res) => {
  try {
    const projects = await OffsetProject.find({ active: true })
      .sort({ featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
});

// @route   POST /api/offset/purchase
// @desc    Purchase carbon offset
// @access  Private
router.post('/purchase', protect, async (req, res) => {
  try {
    const { projectId, tonsOffset } = req.body;

    // Validate input
    if (!projectId || !tonsOffset || tonsOffset <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project or tons amount'
      });
    }

    // Get project
    const project = await OffsetProject.findById(projectId);
    if (!project || !project.active) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or inactive'
      });
    }

    // Calculate amount
    const amountPaid = tonsOffset * project.pricePerTon;

    // Create purchase record
    const purchase = await OffsetPurchase.create({
      userId: req.user.id,
      projectId: project._id,
      tonsOffset,
      amountPaid,
      status: 'completed', // In real app, integrate with payment gateway
      certificate: `CERT-${Date.now()}-${req.user.id}`
    });

    // Update project stats
    project.totalTonsOffset += tonsOffset;
    project.supporters += 1;
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Carbon offset purchase successful!',
      data: purchase
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing purchase'
    });
  }
});

// @route   GET /api/offset/my-purchases
// @desc    Get user's offset purchases
// @access  Private
router.get('/my-purchases', protect, async (req, res) => {
  try {
    const purchases = await OffsetPurchase.find({ userId: req.user.id })
      .populate('projectId')
      .sort({ createdAt: -1 });

    const totalOffset = purchases.reduce((sum, p) => sum + p.tonsOffset, 0);

    res.status(200).json({
      success: true,
      count: purchases.length,
      totalOffset: totalOffset.toFixed(2),
      data: purchases
    });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchases'
    });
  }
});

// @route   GET /api/offset/calculate
// @desc    Calculate offset needed for user's footprint
// @access  Private
router.get('/calculate', protect, async (req, res) => {
  try {
    // Get user's latest calculation
    const calculation = await Calculation.findOne({ userId: req.user.id })
      .sort({ calculatedAt: -1 });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'No calculations found'
      });
    }

    const yearlyFootprint = calculation.results.perYear;
    const tonsToOffset = (yearlyFootprint / 1000).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        yearlyFootprint,
        tonsToOffset,
        message: `You need to offset ${tonsToOffset} tons of CO₂ to become carbon neutral`
      }
    });
  } catch (error) {
    console.error('Calculate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating offset'
    });
  }
});

module.exports = router;