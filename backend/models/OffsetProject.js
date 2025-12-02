const mongoose = require('mongoose');

const offsetProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Reforestation', 'Renewable Energy', 'Water Conservation', 'Wildlife Protection', 'Ocean Cleanup'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pricePerTon: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  certified: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  totalTonsOffset: {
    type: Number,
    default: 0
  },
  supporters: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OffsetProject', offsetProjectSchema);