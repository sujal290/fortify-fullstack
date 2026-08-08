// PATH: server/models/Cart.js  (REPLACES existing file — adds variantId/variantLabel)
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        // Present only for variant products — references product.variants[i]._id.
        variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
        // Denormalized display label ("Black / M") captured at add-time, so the
        // cart shows what the customer picked even if the product's variants
        // change later. Not used for stock/price — those always read live.
        variantLabel: { type: String, default: '' },
        qty: { type: Number, required: true, default: 1 },
      },
    ],
    // Set when an abandoned-cart reminder is sent, so the cron job doesn't email the same cart daily.
    lastReminderSentAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);