const {createUser, findUser, verifyUser} = require('../controllers/userController.js');
const path = require('path');

const express = require('express');
const router = express.Router();

router.post('/signup', createUser);

router.post('/verify', verifyUser); 

router.get('/home/verifyId123', (req, res) => { 
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
});
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
});; 

router.get('/home/loginId313', (req, res) => { 
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
 });
router.get('/home/signUpId6969', (req, res) => { 
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
});

router.post('/login', findUser);
module.exports = router;

