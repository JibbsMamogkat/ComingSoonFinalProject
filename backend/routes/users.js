const {createUser} = require('../controllers/userController.js');
const path = require('path');

const express = require('express');
const router = express.Router();

router.post('/home', createUser);

router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
});; 

module.exports = router;

