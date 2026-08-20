const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ total: 46500, paid: 45000, due: 1500, history: [] });
});

module.exports = router;