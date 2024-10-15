require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/menuItemSchema'); // Ensure this path is correct

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MongoDB connection error: MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

const sampleMenuItems = [
    // Appetizers
    { name: 'Lumpia', price: 6, description: 'Filipino-style spring rolls', category: 'Appetizer', available: true, isPopular: true },
    { name: 'Kwek-Kwek', price: 5, description: 'Deep-fried quail eggs', category: 'Appetizer', available: true, isPopular: false },
    { name: 'Tokwa\'t Baboy', price: 7, description: 'Fried tofu and pork with vinegar sauce', category: 'Appetizer', available: true, isPopular: true },
    { name: 'Chicharon', price: 4, description: 'Crispy pork rinds', category: 'Appetizer', available: true, isPopular: false },
    { name: 'Calamares', price: 8, description: 'Deep-fried squid rings', category: 'Appetizer', available: true, isPopular: true },

    // Main Courses
    { name: 'Adobo', price: 10, description: 'A delicious Filipino dish with marinated meat', category: 'Main', available: true, isPopular: true },
    { name: 'Sinigang', price: 12, description: 'A tangy tamarind-based soup', category: 'Main', available: true, isPopular: false },
    { name: 'Kare-Kare', price: 15, description: 'A rich peanut sauce stew', category: 'Main', available: true, isPopular: true },
    { name: 'Lechon', price: 20, description: 'Roasted whole pig', category: 'Main', available: true, isPopular: true },
    { name: 'Pancit', price: 8, description: 'Stir-fried noodles', category: 'Main', available: true, isPopular: true },
    { name: 'Bistek Tagalog', price: 14, description: 'Filipino beef steak', category: 'Main', available: true, isPopular: false },
    { name: 'Chicken Inasal', price: 13, description: 'Grilled chicken marinated in vinegar and spices', category: 'Main', available: true, isPopular: true },
    { name: 'Laing', price: 9, description: 'Taro leaves in coconut milk', category: 'Main', available: true, isPopular: false },
    { name: 'Pinakbet', price: 10, description: 'Mixed vegetables with shrimp paste', category: 'Main', available: true, isPopular: true },
    { name: 'Bulalo', price: 18, description: 'Beef shank soup', category: 'Main', available: true, isPopular: true },

    // Desserts
    { name: 'Halo-Halo', price: 8, description: 'A refreshing dessert with mixed fruits and shaved ice', category: 'Dessert', available: true, isPopular: true },
    { name: 'Bibingka', price: 5, description: 'A type of rice cake', category: 'Dessert', available: true, isPopular: false },
    { name: 'Leche Flan', price: 6, description: 'Creamy caramel custard', category: 'Dessert', available: true, isPopular: true },
    { name: 'Turon', price: 4, description: 'Banana spring rolls', category: 'Dessert', available: true, isPopular: true },
    { name: 'Ube Halaya', price: 7, description: 'Purple yam jam', category: 'Dessert', available: true, isPopular: false }
];

MenuItem.insertMany(sampleMenuItems)
    .then(() => {
        console.log('Sample menu items added successfully!');
        mongoose.connection.close();
    })
    .catch(error => console.error('Error adding sample menu items:', error));