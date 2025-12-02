const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Calculation = require('../models/sahilcalculator');

// @route   GET /api/recommendations
// @desc    Get AI-powered recommendations based on latest calculation
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get user's latest calculation
    const latestCalculation = await Calculation.findOne({ userId: req.user.id })
      .sort({ calculatedAt: -1 });

    if (!latestCalculation) {
      return res.status(404).json({
        success: false,
        message: 'No calculations found. Complete a calculation first.'
      });
    }

    // Generate AI recommendations
    const recommendations = generateRecommendations(latestCalculation);

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations'
    });
  }
});

// AI Logic for generating recommendations
function generateRecommendations(calculation) {
  const { results, transportation, homeEnergy, food, shopping, waste } = calculation;
  const recommendations = [];

  // Transportation Recommendations
  if (results.transportation > 50) {
    if (transportation.carType === 'petrol' || transportation.carType === 'diesel') {
      recommendations.push({
        id: 1,
        priority: 'HIGH',
        category: 'Transportation',
        title: 'Switch to Electric or Hybrid Vehicle',
        description: 'Your car emissions are high. An electric vehicle could reduce your transport emissions by 70%.',
        impact: `Save ${(transportation.carKm * 0.139).toFixed(0)} kg CO₂/month`,
        savings: (transportation.carKm * 0.139 * 12).toFixed(0),
        difficulty: 'Medium',
        cost: 'High',
        timeframe: '6-12 months',
        steps: [
          'Research electric vehicle models',
          'Check government subsidies',
          'Find nearby charging stations',
          'Compare total cost of ownership'
        ]
      });
    }

    if (transportation.carKm > 500) {
      recommendations.push({
        id: 2,
        priority: 'MEDIUM',
        category: 'Transportation',
        title: 'Use Public Transport or Carpool',
        description: `You drive ${transportation.carKm} km/month. Switching to public transport for even 30% of trips would help.`,
        impact: `Save ${(transportation.carKm * 0.3 * 0.103).toFixed(0)} kg CO₂/month`,
        savings: (transportation.carKm * 0.3 * 0.103 * 12).toFixed(0),
        difficulty: 'Easy',
        cost: 'Low',
        timeframe: 'Immediate',
        steps: [
          'Find bus/metro routes for your commute',
          'Join a carpooling app',
          'Work from home 2 days/week',
          'Combine errands to reduce trips'
        ]
      });
    }
  }

  // Home Energy Recommendations
  if (results.homeEnergy > 60 && !homeEnergy.renewableEnergy) {
    recommendations.push({
      id: 3,
      priority: 'HIGH',
      category: 'Home Energy',
      title: 'Install Solar Panels',
      description: 'Your electricity usage is high. Solar panels could reduce your energy emissions by 70%.',
      impact: `Save ${(homeEnergy.electricityKwh * 0.527 * 0.7).toFixed(0)} kg CO₂/month`,
      savings: (homeEnergy.electricityKwh * 0.527 * 0.7 * 12).toFixed(0),
      difficulty: 'High',
      cost: 'High',
      timeframe: '3-6 months',
      paybackPeriod: '5-7 years',
      steps: [
        'Get solar panel quotes from 3 providers',
        'Check roof suitability',
        'Apply for government subsidies',
        'Calculate payback period'
      ]
    });
  }

  if (homeEnergy.electricityKwh > 300) {
    recommendations.push({
      id: 4,
      priority: 'MEDIUM',
      category: 'Home Energy',
      title: 'Switch to LED Bulbs & Energy-Efficient Appliances',
      description: 'Simple changes can reduce your electricity by 25%.',
      impact: `Save ${(homeEnergy.electricityKwh * 0.25 * 0.527).toFixed(0)} kg CO₂/month`,
      savings: (homeEnergy.electricityKwh * 0.25 * 0.527 * 12).toFixed(0),
      difficulty: 'Easy',
      cost: 'Low',
      timeframe: '1 month',
      steps: [
        'Replace all bulbs with LED',
        'Unplug devices when not in use',
        'Use energy-saving mode on appliances',
        'Set AC to 24°C instead of 18°C'
      ]
    });
  }

  // Food Recommendations
  if (results.food > 100) {
    if (food.meatFrequency === 'daily') {
      recommendations.push({
        id: 5,
        priority: 'HIGH',
        category: 'Food & Diet',
        title: 'Reduce Meat Consumption',
        description: 'Daily meat consumption has the highest carbon impact. Try "Meatless Mondays".',
        impact: `Save ${((52 - 26) * 4).toFixed(0)} kg CO₂/month`,
        savings: ((52 - 26) * 4 * 12).toFixed(0),
        difficulty: 'Easy',
        cost: 'Low',
        timeframe: 'Immediate',
        steps: [
          'Start with 2 vegetarian days per week',
          'Try plant-based meat alternatives',
          'Explore new vegetarian recipes',
          'Focus on beans, lentils, and chickpeas'
        ]
      });
    }

    if (!food.localFood) {
      recommendations.push({
        id: 6,
        priority: 'LOW',
        category: 'Food & Diet',
        title: 'Buy Local & Seasonal Produce',
        description: 'Imported food has a high transport footprint.',
        impact: `Save ${(results.food * 0.15).toFixed(0)} kg CO₂/month`,
        savings: (results.food * 0.15 * 12).toFixed(0),
        difficulty: 'Easy',
        cost: 'Low',
        timeframe: 'Immediate',
        steps: [
          'Shop at local farmers markets',
          'Choose seasonal vegetables',
          'Grow herbs at home',
          'Join a community garden'
        ]
      });
    }
  }

  // Shopping Recommendations
  if (shopping.clothingItemsPerMonth > 5) {
    recommendations.push({
      id: 7,
      priority: 'MEDIUM',
      category: 'Shopping',
      title: 'Buy Second-Hand & Quality Over Quantity',
      description: 'Fast fashion has a huge carbon footprint.',
      impact: `Save ${(shopping.clothingItemsPerMonth * 22 * 0.5).toFixed(0)} kg CO₂/month`,
      savings: (shopping.clothingItemsPerMonth * 22 * 0.5 * 12).toFixed(0),
      difficulty: 'Easy',
      cost: 'Low',
      timeframe: 'Immediate',
      steps: [
        'Shop at thrift stores',
        'Buy durable, quality items',
        'Repair instead of replace',
        'Sell or donate old clothes'
      ]
    });
  }

  // Waste Recommendations
  if (!waste.recycling || !waste.composting) {
    recommendations.push({
      id: 8,
      priority: 'LOW',
      category: 'Waste Management',
      title: 'Start Recycling & Composting',
      description: 'Proper waste management significantly reduces emissions.',
      impact: `Save ${(results.waste * 0.4).toFixed(0)} kg CO₂/month`,
      savings: (results.waste * 0.4 * 12).toFixed(0),
      difficulty: 'Easy',
      cost: 'Low',
      timeframe: 'Immediate',
      steps: [
        'Set up separate bins for recyclables',
        'Start a compost bin for food scraps',
        'Learn what can be recycled in your area',
        'Avoid single-use plastics'
      ]
    });
  }

  // Sort by priority and impact
  return recommendations.sort((a, b) => {
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

module.exports = router;