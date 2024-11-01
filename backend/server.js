require('dotenv').config();   // Load environment variables from .env
const express = require('express');
const multer = require('multer'); // Add this line
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/users.js');

const MenuItem = require('./models/menuItemSchema');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('', userRoutes);

// Serve static files from the root or `frontend` folder
app.use(express.static('frontend')); // Adjust the path if needed

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('MongoDB connection error:', error));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});



const upload = multer({ storage: storage });

// Serve the menu page
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/menu.html'));
});

// Endpoint to upload image and create menu item
app.post('/menuItem', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, available, isPopular } = req.body;
    const image = req.file.path; // Path to the uploaded image

    const menuItem = new MenuItem({ name, description, price, category, available, isPopular, image });
    await menuItem.save();

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Endpoint to retrieve menu items by category
app.get('/api/menuItems', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve menu items' });
  }
});

//cart routes
const cartRoutes = require('./routes/cartRoutes.js');
console.log('Server is registering cart routes on /api');
app.use('/api', cartRoutes);
console.log('Cart routes registered on /api');

//serve cart page
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/cart.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
