const mongoose = require('mongoose');
const MenuItem = require('./models/menuItemSchema'); // Make sure this path is correct

const mongoUri = 'mongodb+srv://ComingSoon:pinoyplates@pinoyplates.qdm8o.mongodb.net/?retryWrites=true&w=majority&appName=PinoyPlates';


// Define the image paths based on the names of menu items
const imagePaths = {
    "Lumpia": '../frontend/images/menuItems/lumpia.jpg',
    'Kwek-Kwek': '../frontend/images/menuItems/kwek-kwek.jpg',
    'Tokwa\'t Baboy': '../frontend/images/menuItems/tokwatbaboy.jpg',
    'Chicharon': '../frontend/images/menuItems/chicharon.jpg',
    'Calamares': '../frontend/images/menuItems/calamares.jpg',
    'Adobo': '../frontend/images/menuItems/adobo.jpg',
    'Sinigang': '../frontend/images/menuItems/sinigang.jpg',
    'Kare-Kare': '../frontend/images/menuItems/kare-kare.jpg',
    'Lechon': '../frontend/images/menuItems/lechon.jpg',
    'Pancit': '../frontend/images/menuItems/pancit.jpg',
    'Bistek Tagalog': '../frontend/images/menuItems/bistektagalog.jpg',
    'Chicken Inasal': '../frontend/images/menuItems/chickeninasal.jpg',
    'Laing': '../frontend/images/menuItems/laing.jpg',
    'Pinakbet': '../frontend/images/menuItems/pinakbet.jpg',
    'Bulalo': '../frontend/images/menuItems/bulalo.jpg',
    'Halo-Halo': '../frontend/images/menuItems/halohalo.jpg',
    'Bibingka': '../frontend/images/menuItems/bibingka.jpg',
    'Leche Flan': '../frontend/images/menuItems/lecheflan.jpg',
    'Turon': '../frontend/images/menuItems/turon.jpg',
    'Ube Halaya': '../frontend/images/menuItems/ubehalaya.jpg'
};

async function updateMenuItemsWithImages() {
    try {
        await mongoose.connect('mongodb+srv://ComingSoon:pinoyplates@pinoyplates.qdm8o.mongodb.net/?retryWrites=true&w=majority&appName=PinoyPlates', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        for (const [name, imagePath] of Object.entries(imagePaths)) {
            const result = await MenuItem.updateOne(
                { name: name },                // Find item by name
                { $set: { imagePath: imagePath } } // Set the imagePath field
            );

            if (result.matchedCount > 0) {
                console.log(`Updated ${name} with image path: ${imagePath}`);
            } else {
                console.warn(`No item found with name "${name}", or image path was already set.`);
            }
        }

        console.log('Menu items updated with image paths');
    } catch (error) {
        console.error('Error updating menu items with image paths:', error);
    } finally {
        mongoose.disconnect();
    }
}

// Run the function
updateMenuItemsWithImages();
