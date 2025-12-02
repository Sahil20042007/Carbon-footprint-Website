const express = require('express');
const router = express.Router();
const Calculation = require('../models/sahilcalculator');
const { protect } = require('../middleware/auth');

// Carbon Emission Factors (kg CO2)
const EMISSION_FACTORS = {
  car: {
    petrol: 0.192,
    diesel: 0.171,
    electric: 0.053,
    hybrid: 0.109
  },
  publicTransport: 0.089,
  flight: {
    shortHaul: 0.255,
    longHaul: 0.195
  },
  bike: 0,
  electricity: 0.527,
  naturalGas: 0.203,
  heatingOil: 0.298,
  meat: {
    daily: 52.0,
    weekly: 26.0,
    monthly: 8.67,
    rarely: 2.6,
    never: 0
  },
  dairy: {
    daily: 28.8,
    weekly: 14.4,
    monthly: 4.8,
    rarely: 1.44,
    never: 0
  },
  clothing: 22.0,
  electronics: 85.0,
  onlineOrder: 0.5,
  plasticUsage: {
    high: 12.0,
    medium: 6.0,
    low: 2.0
  }
};

// Calculate carbon footprint
const calculateFootprint = (data) => {
  const results = {
    transportation: 0,
    homeEnergy: 0,
    food: 0,
    shopping: 0,
    waste: 0
  };
  
  // Transportation
  const carEmission = parseFloat(data.transportation.carKm || 0) * EMISSION_FACTORS.car[data.transportation.carType || 'petrol'];
  const publicTransportEmission = parseFloat(data.transportation.publicTransportKm || 0) * EMISSION_FACTORS.publicTransport;
  const shortFlightEmission = parseFloat(data.transportation.flightShortHaul || 0) * 500 * EMISSION_FACTORS.flight.shortHaul;
  const longFlightEmission = parseFloat(data.transportation.flightLongHaul || 0) * 3000 * EMISSION_FACTORS.flight.longHaul;
  
  results.transportation = carEmission + publicTransportEmission + shortFlightEmission + longFlightEmission;
  
  // Home Energy
  const electricityEmission = parseFloat(data.homeEnergy.electricityKwh || 0) * EMISSION_FACTORS.electricity;
  const gasEmission = parseFloat(data.homeEnergy.naturalGasKwh || 0) * EMISSION_FACTORS.naturalGas;
  const oilEmission = parseFloat(data.homeEnergy.heatingOil || 0) * EMISSION_FACTORS.heatingOil;
  
  results.homeEnergy = electricityEmission + gasEmission + oilEmission;
  
  if (data.homeEnergy.renewableEnergy) {
    results.homeEnergy *= 0.3;
  }
  
  // Food
  const meatEmission = EMISSION_FACTORS.meat[data.food.meatFrequency || 'weekly'] * 4;
  const dairyEmission = EMISSION_FACTORS.dairy[data.food.dairyFrequency || 'daily'] * 4;
  
  results.food = meatEmission + dairyEmission;
  
  if (data.food.localFood) {
    results.food *= 0.85;
  }
  
  // Shopping
  const clothingEmission = parseFloat(data.shopping.clothingItemsPerMonth || 0) * EMISSION_FACTORS.clothing;
  const electronicsEmission = (parseFloat(data.shopping.electronicsPerYear || 0) / 12) * EMISSION_FACTORS.electronics;
  const orderEmission = parseFloat(data.shopping.onlineOrdersPerMonth || 0) * EMISSION_FACTORS.onlineOrder;
  
  results.shopping = clothingEmission + electronicsEmission + orderEmission;
  
  if (data.shopping.secondHand) {
    results.shopping *= 0.5;
  }
  
  // Waste
  results.waste = EMISSION_FACTORS.plasticUsage[data.waste.plasticUsage || 'medium'];
  
  if (data.waste.recycling) {
    results.waste *= 0.7;
  }
  if (data.waste.composting) {
    results.waste *= 0.8;
  }
  
  // Total
  results.total = results.transportation + results.homeEnergy + results.food + results.shopping + results.waste;
  results.perDay = results.total / 30;
  results.perYear = results.total * 12;
  
  return results;
};

// @route   POST /api/calculation
// @desc    Create new calculation
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    console.log('📥 Received calculation request');
    console.log('👤 User ID:', req.user.id);
    console.log('📊 Request body:', JSON.stringify(req.body, null, 2));
    
    const calculationData = {
      userId: req.user.id,
      transportation: req.body.transportation || {},
      homeEnergy: req.body.homeEnergy || {},
      food: req.body.food || {},
      shopping: req.body.shopping || {},
      waste: req.body.waste || {}
    };
    
    console.log('🔢 Calculation data prepared');
    
    const results = calculateFootprint(calculationData);
    console.log('✅ Results calculated:', JSON.stringify(results, null, 2));
    
    calculationData.results = results;
    
    const calculation = await Calculation.create(calculationData);
    console.log('💾 Saved to database:', calculation._id);
    
    res.status(201).json({
      success: true,
      message: 'Calculation completed successfully',
      data: calculation
    });
  } catch (error) {
    console.error('❌ Calculation Error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error calculating carbon footprint',
      error: error.message
    });
  }
});

// @route   GET /api/calculation
// @desc    Get all calculations for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const calculations = await Calculation.find({ userId: req.user.id })
      .sort({ calculatedAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      count: calculations.length,
      data: calculations
    });
  } catch (error) {
    console.error('Get Calculations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching calculations',
      error: error.message
    });
  }
});

// @route   GET /api/calculation/:id
// @desc    Get single calculation
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id);
    
    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }
    
    if (calculation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this calculation'
      });
    }
    
    res.status(200).json({
      success: true,
      data: calculation
    });
  } catch (error) {
    console.error('Get Calculation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching calculation',
      error: error.message
    });
  }
});

// @route   DELETE /api/calculation/:id
// @desc    Delete calculation
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id);
    
    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }
    
    if (calculation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this calculation'
      });
    }
    
    await calculation.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Calculation deleted successfully'
    });
  } catch (error) {
    console.error('Delete Calculation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting calculation',
      error: error.message
    });
  }
});

module.exports = router;