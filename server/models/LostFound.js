const mongoose = require('mongoose');

const LostFoundSchema = new mongoose.Schema({
  itemType: String,
  description: String,
  location: String,
  imageBase64: String,
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  aiAnalysis: {
    itemType: String,
    color: String,
    textFound: String,
    confidence: Number
  },
  status: {
    type: String,
    enum: ['lost', 'found']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LostFound', LostFoundSchema);