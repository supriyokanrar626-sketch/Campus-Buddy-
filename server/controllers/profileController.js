const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json(user);
};

exports.uploadAvatar = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { photoURL: req.body.base64 }, { new: true });
  res.json(user);
};