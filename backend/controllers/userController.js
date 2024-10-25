const User = require('../models/userSchema.js');

const createUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address, password } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email, phoneNumber, address, password });
    res.redirect('/menu');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createUser};