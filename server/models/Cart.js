const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true, default: 1 },
      },
    ],
    // Set when an abandoned-cart reminder is sent, so the cron job doesn't email the same cart daily.
    lastReminderSentAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);