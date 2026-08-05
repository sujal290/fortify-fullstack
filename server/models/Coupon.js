const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['flat', 'percentage'], required: true },
    value: { type: Number, required: true }, // ₹ for flat, % for percentage
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number }, // caps a percentage coupon's discount, optional
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Computes the discount for a given cart subtotal, or throws with a reason.
couponSchema.methods.calculateDiscount = function (subtotal) {
  if (!this.isActive) throw new Error('This coupon is no longer active');
  if (this.expiresAt && this.expiresAt < new Date()) throw new Error('This coupon has expired');
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) throw new Error('This coupon has reached its usage limit');
  if (subtotal < this.minOrderValue) throw new Error(`Minimum order value for this coupon is ₹${this.minOrderValue}`);

  let discount = this.type === 'flat' ? this.value : (subtotal * this.value) / 100;
  if (this.maxDiscount) discount = Math.min(discount, this.maxDiscount);
  return Math.round(Math.min(discount, subtotal));
};

module.exports = mongoose.model('Coupon', couponSchema);
