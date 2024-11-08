const path = require('path');

const express = require('express');
const router = express.Router();

router.get('/about', (req, res)=> {
  res.sendFile(path.join(__dirname, '../../frontend/pages/about.html'));
});
router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/contact.html'));
});
router.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/checkout.html'));
});

router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/adminpage.html'));
});
module.exports = router;