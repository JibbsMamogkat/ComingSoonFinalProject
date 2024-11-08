const path = require('path');

const express = require('express');
const router = express.Router();

router.get('/about', (req, res)=> {
  res.sendFile(path.join(__dirname, '../../frontend/pages/about.html'));
});
router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/contact.html'));
});

module.exports = router;