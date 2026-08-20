const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ overall: 74, subjects: ['DBMS 32/40 80%', 'DSA 28/42 66%', 'OS 35/38 92%'] });
});

module.exports = router;