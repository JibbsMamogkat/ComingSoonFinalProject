require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/menuItemSchema'); // Ensure this path is correct

const mongoUri = 'mongodb+srv://ComingSoon:pinoyplates@pinoyplates.qdm8o.mongodb.net/?retryWrites=true&w=majority&appName=PinoyPlates';

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

// price multiplier
const priceMultiplier = 10;

const sampleMenuItems = [
    // Appetizers
    { name: 'Lumpia', price: 6 * priceMultiplier, description: 'Filipino-style spring rolls', category: 'Appetizer', available: true, isPopular: true, imagePath: '/images/menuItems/lumpia.jpg' },
    { name: 'Kwek-Kwek', price: 5 * priceMultiplier, description: 'Deep-fried quail eggs', category: 'Appetizer', available: true, isPopular: false, imagePath: '/images/menuItems/kwek-kwek.jpg' },
    { name: 'Tokwa\'t Baboy', price: 7 * priceMultiplier, description: 'Fried tofu and pork with vinegar sauce', category: 'Appetizer', available: true, isPopular: true, imagePath: '/images/menuItems/tokwatbaboy.jpg' },
    { name: 'Chicharon', price: 4 * priceMultiplier, description: 'Crispy pork rinds', category: 'Appetizer', available: true, isPopular: false, imagePath: '/images/menuItems/chicharon.jpg' },
    { name: 'Calamares', price: 8 * priceMultiplier, description: 'Deep-fried squid rings', category: 'Appetizer', available: true, isPopular: true, imagePath: '/images/menuItems/calamares.jpg' },

    // Main Courses
    { name: 'Adobo', price: 10 * priceMultiplier, description: 'A delicious Filipino dish with marinated meat', category: 'Main', available: true, isPopular: true, imagePath: '/images/menuItems/adobo.jpg' },
    { name: 'Sinigang', price: 12 * priceMultiplier, description: 'A tangy tamarind-based soup', category: 'Main', available: true, isPopular: false, imagePath: '/images/menuItems/sinigang.jpg' },
    { name: 'Kare-Kare', price: 15 * priceMultiplier, description: 'A rich peanut sauce stew', category: 'Main', available: true, isPopular: true, imagePath: '/images/menuItems/kare-kare.jpg' },
    { name: 'Lechon', price: 20 * priceMultiplier, description: 'Roasted whole pig', category: 'Main', available: true, isPopular: true, imagePath: '/images/menuItems/lechon.jpg' },
    { name: 'Pancit', price: 8 * priceMultiplier, description: 'Stir-fried noodles', category: 'Main', available: true, isPopular: true, imagePath: '/images/menuItems/pancit.jpg' },
    { name: 'Bistek Tagalog', price: 14 * priceMultiplier, description: 'Filipino beef steak', category: 'Main', available: true, isPopular: false, imagePath: '/images/menuItems/bistektagalog.jpg' },
    { name: 'Chicken Inasal', price: 13 * priceMultiplier, description: 'Grilled chicken marinated in vinegar and spices', category: 'Main', available: true, isPopular: true, imagePath: '/images/menuItems/chickeninasal.jpg' },
    { name: 'Laing', price: 9 * priceMultiplier, description: 'Taro leaves in coconut milk', category: 'Main', available: true, isPopular: false, imagePath: '/images/menuItems/laing.jpg' },
    { name: 'Pinakbet', price: 10 * priceMultiplier, description: 'Mixed vegetables with shrimp paste', category: 'Main', available: true, isPopular: true, imagePath: '/images/menuItems/pinakbet.jpg' },
    { name: 'Bulalo', price: 18 * priceMultiplier, description: 'Beef shank soup', category: 'Main', available: true, isPopular: true, imagePath: '/images/menuItems/bulalo.jpg' },

    // Desserts
    { name: 'Halo-Halo', price: 8 * priceMultiplier, description: 'A refreshing dessert with mixed fruits and shaved ice', category: 'Dessert', available: true, isPopular: true, imagePath: '/images/menuItems/halohalo.jpg' },
    { name: 'Bibingka', price: 5 * priceMultiplier, description: 'A type of rice cake', category: 'Dessert', available: true, isPopular: false, imagePath: '/images/menuItems/bibingka.jpg' },
    { name: 'Leche Flan', price: 6 * priceMultiplier, description: 'Creamy caramel custard', category: 'Dessert', available: true, isPopular: true, imagePath: '/images/menuItems/lecheflan.jpg' },
    { name: 'Turon', price: 4 * priceMultiplier, description: 'Banana spring rolls', category: 'Dessert', available: true, isPopular: true, imagePath: '/images/menuItems/turon.jpg' },
    { name: 'Ube Halaya', price: 7 * priceMultiplier, description: 'Purple yam jam', category: 'Dessert', available: true, isPopular: false, imagePath: '/images/menuItems/ubehalaya.jpg' }
];

MenuItem.insertMany(sampleMenuItems)
    .then(() => {
        console.log('Sample menu items added successfully!');
        mongoose.connection.close();
    })
    .catch(error => console.error('Error adding sample menu items:', error));