const OffsetProject = require('../models/OffsetProject');
// [FIX 1] Import your EXISTING model
const OffsetPurchase = require('../models/OffsetPurchase'); 
const sendEmail = require('../utils/emailService');
const Calculation = require('../models/sahilcalculator'); 

// @desc    Get all active offset projects
// @route   GET /api/offset/projects
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await OffsetProject.find({ active: true });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Purchase carbon offset
// @route   POST /api/offset/purchase
exports.purchaseOffset = async (req, res, next) => {
  try {
    const { projectId, tonsOffset } = req.body;

    // 1. Validate Project
    const project = await OffsetProject.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // 2. Calculate Cost
    const totalCost = tonsOffset * project.pricePerTon;

    // 3. Create Purchase Record (Using YOUR Schema fields)
    const purchase = await OffsetPurchase.create({
      userId: req.user.id,
      projectId: projectId,
      tonsOffset: tonsOffset,
      amountPaid: totalCost,     // [FIX 2] Matches your schema's 'amountPaid'
      status: 'completed',       // [FIX 3] Matches your enum
      currency: 'INR',
      certificate: `CERT-${Date.now()}-${req.user.id.toString().slice(-4)}` // Generate a dummy cert ID
    });

    // 4. Update Project Stats
    project.totalTonsOffset += tonsOffset;
    project.supporters += 1;
    await project.save();

    // 5. ⚡ Real-time Notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new_offset', {
        message: `🌱 ${req.user.name} just offset ${tonsOffset} tons of CO2!`,
        tons: tonsOffset,
        user: req.user.name
      });
    }

    // 6. 📧 Send Email
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Carbon Offset Certificate ✅',
        message: `<h1>Thank You!</h1><p>You offset ${tonsOffset} tons via ${project.name}.</p>`
      });
    } catch (err) {
      console.log('Email failed:', err.message);
    }

    res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my purchases
// @route   GET /api/offset/my-purchases
exports.getMyPurchases = async (req, res, next) => {
  try {
    // [FIX 4] Use OffsetPurchase model
    const purchases = await OffsetPurchase.find({ userId: req.user.id })
      .populate('projectId') // Optional: Get project details
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: purchases.length, data: purchases });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate offset needed
// @route   GET /api/offset/calculate
exports.getOffsetForCalculation = async (req, res, next) => {
  try {
    const calculation = await Calculation.findOne({ userId: req.user.id }).sort({ calculatedAt: -1 });
    
    if (!calculation) {
      return res.status(404).json({ success: false, message: 'No calculations found' });
    }

    const yearlyFootprint = calculation.results.perYear || calculation.results.total * 12;
    const tonsToOffset = (yearlyFootprint / 1000).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        yearlyFootprint,
        tonsToOffset,
        message: `You need to offset ${tonsToOffset} tons of CO₂`
      }
    });
  } catch (error) {
    next(error);
  }
};