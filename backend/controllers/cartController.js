const Cart = require('../models/cartModel');
// add to cart

exports.addItemToCart = async (req, res) => {
  const { userId, itemId, name, price } = req.body;
  const quantity = req.body.quantity || 1;

  //console logging for debugging
  console.log('Add to Cart Request Body:', req.body);

    if (!userId || !itemId || !price || !quantity) {
        console.error('Missing required fields in add-to-cart request');
        return res.status(400).json({ error: 'Missing required fields' });
    }


  try {
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      item.quantity += quantity;
      item.totalPrice = item.quantity * item.price;
    } else {
      cart.items.push({ itemId, name, quantity, price, totalPrice: price * quantity });
    }

    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

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
  