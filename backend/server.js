require('dotenv').config();   // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const MenuItem = require('./models/menuItemSchema');

console.log(MenuItem);

const app = express();

// Serve static files from the root or `frontend` folder
app.use(express.static('frontend')); // Adjust the path if needed

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('MongoDB connection error:', error));

// Serve the menu page
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/menu.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//testing
const testItem = new MenuItem({
  name: 'Adobo',
  price: 10,
  description: 'Delicious Filipino dish',
  category: 'Main',
  available: true,
  isPopular: true
});

testItem.save()
  .then(() => console.log('Menu item saved successfully!'))
  .catch(error => console.error('Error saving menu item:', error));

  MenuItem.find({})
  .then(items => console.log('Menu items in database:', items))
  .catch(error => console.error('Error fetching menu items:', error));