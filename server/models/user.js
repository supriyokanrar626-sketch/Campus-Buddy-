const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  studentId: String,
  dept: {
    type: String,
    default: 'CSE'
  },
  stream: {
    type: String,
    default: 'AI-ML'
  },
  course: {
    type: String,
    default: 'B.Tech'
  },
  year: {
    type: String,
    default: '3rd'
  },
  rollNo: String,
  address: String,
  mobileNo: String,
  photoURL: String,
  marksheet: [{
    sem: String,
    gpa: Number,
    sgpa: Number
  }],
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin']
  }
});

module.exports = mongoose.model('User', UserSchema);