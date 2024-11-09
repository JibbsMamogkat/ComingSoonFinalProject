const User = require('../models/userSchema.js');
const Bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pinoyplates404@gmail.com',
    pass: 'gxmu yoha jzkx mqlo'   
  }
});

const createUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address, passwordSignUp } = req.body;

  try {
    const emailExist = await User.findOne({ email: email });
    if (emailExist) { 
      return res.redirect(`/home/signUpId6969?error=${encodeURIComponent('Email already exists.')}`);
    }
    else {
      const hashedPassword = await Bcrypt.hash(passwordSignUp, 10);
      // Temporarily save user data using sessions
      req.session.tempUser = {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password: hashedPassword
      };
      req.session.email = email;
      await sendVerificationCode({ body: { email } }, res);
    }
  } catch (error) {
    res.redirect(`/home/signUpId6969?error=${encodeURIComponent('An error occurred. Please try again.')}`);
  }
};

//send verification code
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = verificationCode; // Store code temporarily 

    // Send the email
    await transporter.sendMail({
      from: 'Pinoy Plates',
      to: email,
      subject: 'Verification Code for Pinoy Plates',
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
    });
    res.redirect('/home/verifyId123');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { code } = req.body;
  const email = req.session.tempUser?.email;
  try {
    const verificationCode = verificationCodes[email];
    if (!verificationCode || verificationCode !== parseInt(code)) {
      return res.redirect(`/home/verifyId123?error=${encodeURIComponent('Incorrect Code.')}`);
    }
    const user = await User.create(req.session.tempUser);
    delete verificationCodes[email];
    delete req.session.tempUser;
    res.redirect('/home/loginId313');
  } catch (error) {
    res.json({ 
      message: error.message,
      link: '/api/verifyError'
     });
  }
};


// Login function to find the user and validate credentials
const findUser = async (req, res) => {
  const { useroremail, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email: useroremail });
    if (useroremail === 'admin' && password === 'admin') {
      return res.redirect('/admin');
    }
    if (!user) {
      return res.redirect(`/home/loginId313?error=${encodeURIComponent('User not found.')}`);
    }
    const isMatch = await Bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(`/home/loginId313?error=${encodeURIComponent('Invalid credentials.')}`);
    }
    req.session.userId = user._id; 
    req.session.email = user.email;
    req.session.firstName = user.firstName;
    req.session.lastName = user.lastName;
    req.session.phoneNumber = user.phoneNumber;
    req.session.address = user.address;
    res.redirect('/home');
  } catch (error) {
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
};




  // newest fo password update:


 // Function to find email and send the verification code
const findEmail = async (req, res) => { 
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect(`/forgot?error=${encodeURIComponent('Email not found.')}`);
    }
    req.session.userId = user._id; 
    req.session.email = email; // Store email in session for later use
    await sendCode({ body: { email } }, res); // Corrected call
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to send the verification code
const sendCode = async (req, res) => {
  const { email } = req.body;
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = verificationCode; // Store code temporarily 

    // Send the email
    await transporter.sendMail({
      from: 'Pinoy Plates',
      to: email,
      subject: 'Verification Code for Pinoy Plates',
      html: `<p>Your verification code to reset password: <strong>${verificationCode}</strong></p>`
    });
    
    res.redirect('/verifyEmail'); // Redirect to verification page
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyCode = async (req, res) => {
  const { code } = req.body;
  const email = req.session.email;
  try {
    const verificationCode = verificationCodes[email];
    if (!verificationCode || verificationCode !== parseInt(code)) {
      return res.redirect(`/verifyEmail?error=${encodeURIComponent('Incorrect Code.')}`);
    }
    delete verificationCodes[email];
    res.redirect('/forgotPassword');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => { 
  const { password } = req.body;
  const userId = req.session.userId;
  try {
    const hashedPassword = await Bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.redirect('/home/loginId313');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { createUser, findUser, verifyUser , findEmail , verifyCode, updatePassword };































