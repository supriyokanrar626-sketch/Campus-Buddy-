const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { reportLostFound, getAllLostFound } = require('../controllers/lostFoundController');

router.post('/report', protect, reportLostFound);
router.get('/all', getAllLostFound);

module.exports = router;