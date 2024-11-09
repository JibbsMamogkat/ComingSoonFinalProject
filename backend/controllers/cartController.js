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
      // If the item exists, increment the quantity by 1
      console.log(`Item with itemId: ${itemId} found in cart, incrementing quantity...`);

      let item = cart.items[itemIndex];
      item.quantity += 1; // Increment the quantity by 1
      console.log(`Incremented quantity to: ${item.quantity}`);

      item.totalPrice = item.quantity * item.price;
    } else {
      // If the item doesn't exist, add it to the cart with the given quantity
      cart.items.push({ itemId, name, quantity, price, totalPrice: price * quantity });
      console.log(`Added new item to cart: ${itemId}`);
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
  // Log if route is accessed
  console.log('Route /api/cart/remove-from-cart accessed');

  const { userId, itemId } = req.body;

  // Validate input data
  if (!userId || !itemId) {
    console.error('Missing userId or itemId in request body');
    return res.status(400).json({ error: 'Missing userId or itemId in request body' });
  }

  console.log(`Received userId: ${userId}, itemId:`, itemId);

  // Extract actual itemId if it is an object
  const actualItemId = typeof itemId === 'object' && itemId._id ? itemId._id.toString() : itemId.toString();

  console.log(`Extracted actual itemId for comparison: ${actualItemId}`);

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.error(`Cart not found for userId: ${userId}`);
      return res.status(404).json({ error: 'Cart not found' });
    }

    console.log('Initial items in cart:', cart.items);

    // Check if the item exists in the cart before removing
    const itemExists = cart.items.some(item => item.itemId.toString() === actualItemId);
    if (!itemExists) {
      console.error(`Item with itemId: ${actualItemId} not found in cart for userId: ${userId}`);
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    console.log(`Item with itemId: ${actualItemId} found in cart, proceeding to remove`);

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item.itemId.toString() !== actualItemId);

    // Log the items after removal for debugging
    console.log('Items in cart after removal:', cart.items);

    // Recalculate the total amount
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
    console.log(`Recalculated total amount for cart: ${cart.totalAmount}`);

    // Save the updated cart
    console.log('Attempting to save updated cart...');
    await cart.save();

    // Log confirmation if item is successfully removed and cart is saved
    console.log(`Item removed from cart - itemId: ${actualItemId}`);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
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
      //log if cart is cleared
      console.log('Cart cleared successfully');
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  };
  

// Update an item in the cart
exports.updateCartItem = async (req, res) => {
  // Log if route is accessed
  console.log('Route /api/cart/update-cart accessed');
  const { userId, itemId, quantity, price } = req.body;

  // Validate input fields
  const missingFields = [];
  if (!userId) missingFields.push('userId');
  if (!itemId) missingFields.push('itemId');
  if (quantity == null || isNaN(quantity)) missingFields.push('quantity');
  if (price == null || isNaN(price)) missingFields.push('price');

  if (missingFields.length > 0) {
    console.error(`Missing or invalid required fields: ${missingFields.join(', ')}`);
    return res.status(400).json({ error: `Missing or invalid required fields: ${missingFields.join(', ')}` });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.error(`Cart not found for userId: ${userId}`);
      return res.status(404).json({ error: 'Cart not found' });
    }
    console.log(`Cart found for userId: ${userId}`);

    // Log received itemId details for debugging
    console.log('Received itemId:', itemId, ', type:', typeof itemId);

    // Extract the actual item ID if itemId is an object with an _id field
    const actualItemId = itemId._id ? itemId._id.toString() : itemId.toString();

    // Find the item in the cart by comparing item IDs
    const itemIndex = cart.items.findIndex(item => item.itemId.toString() === actualItemId);

    if (itemIndex === -1) {
      console.error(`Item with itemId: ${actualItemId} not found in cart for userId: ${userId}`);
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Log success if item is found
    console.log(`Item found with itemId: ${actualItemId}`);

    // Update the quantity and total price of the existing item
    let item = cart.items[itemIndex];
    console.log(`Updating item in cart - itemId: ${itemId}, current quantity: ${item.quantity}, new quantity: ${quantity}`);
    item.quantity = quantity;
    item.totalPrice = quantity * price;
    console.log(`Updated item - new totalPrice: ${item.totalPrice}`);

    // Recalculate the total amount for the cart
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
    console.log(`Recalculated total amount for cart: ${cart.totalAmount}`);

    // Save the updated cart
    console.log('Attempting to save updated cart...');
    await cart.save();
    console.log('Cart successfully updated and saved');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};