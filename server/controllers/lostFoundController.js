exports.reportLostFound = async (req, res) => {
  const lostFound = new (require('../models/LostFound'))({ ...req.body, reportedBy: req.user.id });
  await lostFound.save();
  res.json(lostFound);
};

exports.getAllLostFound = async (req, res) => {
  const lostFound = await require('../models/LostFound').find();
  res.json(lostFound);
};