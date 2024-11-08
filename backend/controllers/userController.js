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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await Bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.session.userId = user._id; 
    res.status(200);
    res.redirect('/home');
  } catch (error) {
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
};
/* For Forgot Password
  const forGotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await sendVerificationCode({ body: { email } }, res);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
  };
*/


module.exports = { createUser, findUser, verifyUser };



/* If FUTURE VERIFICATION IS MESSED UP, WILL USE THIS CODE WITH NO VERIFICATJION

const User = require('../models/userSchema.js');
const Bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address, passwordSignUp } = req.body;
  try {
    const hashedPassword = await Bcrypt.hash(passwordSignUp, 10);
    const user = await User.create({ firstName, lastName, email, phoneNumber, address, password: hashedPassword });
    res.redirect('/home/loginId313');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findUser = async (req, res) => {
  const { useroremail, password } = req.body;
  const email = useroremail;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await Bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // req.session.userId = user._id; // Assuming you're using sessions
    res.redirect('/menu'); // Redirect to homepage after successful login
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createUser, findUser};


*/































