const Cart = require('../models/cartModel');
// add to cart

exports.addItemToCart = async (req, res) => {
  const { userId, itemId, name, price } = req.body;
  const quantity = req.body.quantity || 1;

  // Console logging for debugging
  console.log('Add to Cart Request Body:', req.body);

  // Check for missing fields
  const missingFields = [];
  if (!userId) missingFields.push('userId');
  if (!itemId) missingFields.push('itemId');
  if (!price) missingFields.push('price');
  if (!quantity) missingFields.push('quantity');
  
  if (missingFields.length > 0) {
    console.error(`Missing required fields in add-to-cart request: ${missingFields.join(', ')}`);
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    // Find the item in the cart, if it exists
    const itemIndex = cart.items.findIndex(item => item.itemId == itemId);

    if (itemIndex > -1) {
      // If the item exists, update the quantity directly
      let item = cart.items[itemIndex];
      item.quantity = quantity; // Set quantity directly
      item.totalPrice = item.quantity * item.price;
    } else {
      // If the item doesn't exist, add it to the cart
      cart.items.push({ itemId, name, quantity, price, totalPrice: price * quantity });
    }

    // Recalculate the total amount for the cart
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in addItemToCart controller:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

//remove item from 

exports.removeItemFromCart = async (req, res) => {
    const { userId, itemId } = req.body;
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
  
      cart.items = cart.items.filter(item => item.itemId != itemId);
      cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  };
  

//view cart

exports.viewCart = async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await Cart.findOne({ userId }).populate('items.itemId');
      if (!cart) return res.status(404).json({ error: 'Cart not found' });
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve cart' });
    }
  };
  

//clear cart

exports.clearCart = async (req, res) => {
    const { userId } = req.params;
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { items: [], totalAmount: 0 },
        { new: true }
      );
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  };
  