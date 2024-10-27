const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      name: String,
      quantity: { type: Number, default: 1 },
      price: Number,
      totalPrice: Number
    }
  ],
  totalAmount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);
