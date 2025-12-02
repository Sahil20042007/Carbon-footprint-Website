const mongoose = require('mongoose');

const offsetPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OffsetProject',
    required: true
  },
  tonsOffset: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  certificate: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OffsetPurchase', offsetPurchaseSchema);