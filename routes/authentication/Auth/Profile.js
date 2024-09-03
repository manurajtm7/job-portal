const express = require('express');
const router = express.Router();

// Profile route
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user);
});

module.exports = router;
