const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController.js');


console.log('Registering routes in cartRoutes.js');
router.get('/test-route', (req, res) => {
    res.send('Test route is working');
});

router.post('/cart/add-to-cart', (req, res, next) => {
    console.log('Route /api/cart/add-to-cart accessed');
    next();
}, cartController.addItemToCart);

// Route to update an item in the cart
router.put('/cart/update-cart', cartController.updateCartItem);


router.delete('/cart/remove-from-cart', cartController.removeItemFromCart);
router.get('/cart/view-cart/:userId', cartController.viewCart);
router.delete('/cart/clear-cart/:userId', cartController.clearCart);

module.exports = router;
