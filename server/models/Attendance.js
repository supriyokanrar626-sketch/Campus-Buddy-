const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subjects: [{
    name: String,
    totalClasses: Number,
    attended: Number,
    percentage: Number,
    status: String
  }]
});

module.exports = mongoose.model('Attendance', AttendanceSchema);