const mongoose = require('mongoose');

const CATEGORIES = [
  'Pesticides',
  'Organic Fertilizers',
  'Seeds',
  'Farming Tools',
];

const SUBCATEGORIES = {
  Pesticides: ['Insecticides', 'Fungicides', 'Herbicides', 'Other Crop Protection'],
  'Organic Fertilizers': ['Vermicompost', 'Compost', 'Neem-based Fertilizers', 'Organic Manure'],
  Seeds: ['Vegetable Seeds', 'Fruit Seeds', 'Grain Seeds', 'Other Agricultural Seeds'],
  'Farming Tools': ['Sprayers', 'Gardening Tools', 'Hand Tools', 'Irrigation Equipment'],
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      default: 'unit',
      trim: true,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    safetyInformation: {
      type: String,
      default: '',
    },
    usageInstructions: {
      type: String,
      default: '',
    },
    ageRestriction: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });

productSchema.statics.CATEGORIES = CATEGORIES;
productSchema.statics.SUBCATEGORIES = SUBCATEGORIES;

module.exports = mongoose.model('Product', productSchema);
