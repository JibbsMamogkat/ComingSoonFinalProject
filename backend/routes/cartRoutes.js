const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController.js');


console.log('Registering routes in cartRoutes.js');
router.get('/test-route', (req, res) => {
    res.send('Test route is working');
});

// router.post('/add-to-cart', (req, res, next) => {
//     console.log('Route /api/cart/add-to-cart accessed');
//     next();
// }, cartController.addItemToCart);

router.post('/add-to-cart', (req, res) => {
    console.log('POST request received on /api/cart/add-to-cart');
    res.json({ message: 'Test route for add-to-cart works' });
});


router.delete('/remove-from-cart', cartController.removeItemFromCart);
router.get('/view-cart/:userId', cartController.viewCart);
router.delete('/clear-cart/:userId', cartController.clearCart);

module.exports = router;
