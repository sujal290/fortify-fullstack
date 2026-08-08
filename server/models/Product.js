// PATH: server/models/Product.js  (REPLACES existing file — adds optional variants array)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Backpacks',
        'Laptop Bags',
        'Travel Bags',
        'Tote Bags',
        'Sling Bags',
        'Luggage',
        'Duffel Bags',
        'School Bags',
      ],
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    material: {
      type: String,
      default: '',
    },

    color: {
      type: String,
      default: '',
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    // ---------- New Fields ----------

    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },

    tags: {
      type: [{
        type: String,
        lowercase: true,
        trim: true,
      }],
      default: [],
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    weight: {
      type: Number,
      default: 0,
      min: 0,
    },

    dimensions: {
      length: {
        type: Number,
        default: 0,
      },
      width: {
        type: Number,
        default: 0,
      },
      height: {
        type: Number,
        default: 0,
      },
    },

    // Optional — a product with an empty/missing variants array is a single
    // SKU and behaves exactly as before (base price/stock fields are used
    // directly). Once variants exist, THEY become the source of truth for
    // stock and the customer must pick one before adding to cart.
    variants: [
      {
        color: { type: String, trim: true, default: '' },
        size: { type: String, trim: true, default: '' },
        sku: { type: String, trim: true, default: '' },
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: 'text',
  description: 'text',
});

module.exports = mongoose.model('Product', productSchema);