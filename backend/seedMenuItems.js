require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/menuItemSchema');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(error => console.error('MongoDB connection error:', error));

const sampleMenuItems = [
    { name: 'Adobo', price: 10, description: 'A delicious Filipino dish with marinated meat', category: 'Main', available: true, isPopular: true },
    { name: 'Sinigang', price: 12, description: 'A tangy tamarind-based soup', category: 'Soup', available: true, isPopular: false },
    { name: 'Halo-Halo', price: 8, description: 'A refreshing dessert with mixed fruits and shaved ice', category: 'Dessert', available: true, isPopular: true },
    { name: 'Lumpia', price: 6, description: 'Filipino-style spring rolls', category: 'Appetizer', available: true, isPopular: false }
];

MenuItem.insertMany(sampleMenuItems)
    .then(() => {
        console.log('Sample menu items added successfully!');
        mongoose.connection.close();
    })
    .catch(error => console.error('Error adding sample menu items:', error));
