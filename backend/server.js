require('dotenv').config();   // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('MongoDB connection error:', error));

// Serve the menu page
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/menu.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));