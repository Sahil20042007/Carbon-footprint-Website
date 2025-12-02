const mongoose = require('mongoose');

// Calculation Schema
const calculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Transportation Data
  transportation: {
    carKm: { type: Number, default: 0 },
    carType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'], default: 'petrol' },
    publicTransportKm: { type: Number, default: 0 },
    flightShortHaul: { type: Number, default: 0 }, // Number of flights
    flightLongHaul: { type: Number, default: 0 },
    bikeKm: { type: Number, default: 0 }
  },
  
  // Home Energy Data
  homeEnergy: {
    electricityKwh: { type: Number, default: 0 },
    naturalGasKwh: { type: Number, default: 0 },
    heatingOil: { type: Number, default: 0 },
    renewableEnergy: { type: Boolean, default: false }
  },
  
  // Food & Diet Data
  food: {
    meatFrequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'rarely', 'never'], default: 'weekly' },
    dairyFrequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'rarely', 'never'], default: 'daily' },
    localFood: { type: Boolean, default: false },
    organicFood: { type: Boolean, default: false }
  },
  
  // Shopping & Consumption Data
  shopping: {
    clothingItemsPerMonth: { type: Number, default: 0 },
    electronicsPerYear: { type: Number, default: 0 },
    onlineOrdersPerMonth: { type: Number, default: 0 },
    secondHand: { type: Boolean, default: false }
  },
  
  // Waste Management Data
  waste: {
    recycling: { type: Boolean, default: false },
    composting: { type: Boolean, default: false },
    plasticUsage: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
  },
  
  // Calculated Results
  results: {
    transportation: { type: Number, default: 0 }, // kg CO2
    homeEnergy: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
    waste: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    perDay: { type: Number, default: 0 },
    perYear: { type: Number, default: 0 }
  },
  
  calculatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
calculationSchema.index({ userId: 1, calculatedAt: -1 });

module.exports = mongoose.model('Calculation', calculationSchema);