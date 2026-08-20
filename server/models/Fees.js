const mongoose = require('mongoose');

const FeesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  totalFees: Number,
  paid: Number,
  due: Number,
  history: [{
    feeType: String,
    amount: Number,
    status: String,
    date: Date,
    receiptUrl: String
  }]
});

module.exports = mongoose.model('Fees', FeesSchema);