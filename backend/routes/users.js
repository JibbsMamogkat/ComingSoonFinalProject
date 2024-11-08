const {createUser, findUser, verifyUser, findEmail, verifyCode, updatePassword} = require('../controllers/userController.js');
const path = require('path');

const express = require('express');
const router = express.Router();

router.post('/signup', createUser);

router.post('/verify', verifyUser); 

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
    req.session = null;
  });
});

router.get('/home/verifyId123', (req, res) => { 
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
  
});
router.get('/home', (req, res) => {
  const isLoggedIn = !!req.session.userId; // Check if user is logged in
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'), {
    headers: {
      'X-User-LoggedIn': isLoggedIn // Set a custom header to indicate login status
    }
  });
}); 

router.get('/api/user-info', (req, res) => {
  res.json({ userId: req.session.userId , email: req.session.email});
});
router.get('/home/loginId313', (req, res) => { 
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
 });
router.get('/home/signUpId6969', (req, res) => { 
  res.sendFile(path.join(__dirname, '../../frontend/pages/homepage.html'));
});

router.post('/login', findUser);


// newest
router.post('/forgotPassword', findEmail);
router.get('/forgot', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/forgot-password.html'));
});

router.post('/verifyCode', verifyCode );
router.get('/verifyEmail', (req, res) =>{
  res.sendFile(path.join(__dirname, '../../frontend/pages/verify-code.html'));
});


router.get('/forgotPassword', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/reset-password.html'));
});
router.post('/updatePassword',  updatePassword);
module.exports = router;

