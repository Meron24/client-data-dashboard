const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, (req, res) => {
  // Access user info from token
  res.json({ message: 'This is a protected profile route', user: req.user });
});

module.exports = router;
