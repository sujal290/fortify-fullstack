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