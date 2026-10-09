const mongoose = require('mongoose');

const BLOG_CATEGORIES = [
  'Organic Farming',
  'Fertilizer Management',
  'Crop Protection',
  'Seed Selection',
  'Modern Farming Technology',
  'Sustainable Agriculture',
];

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 500,
    },
    image: {
      type: String,
      required: [true, 'Featured image is required'],
    },
    category: {
      type: String,
      required: true,
      enum: BLOG_CATEGORIES,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
blogSchema.index({ category: 1, published: 1 });
blogSchema.index({ createdAt: -1 });

blogSchema.statics.CATEGORIES = BLOG_CATEGORIES;

module.exports = mongoose.model('Blog', blogSchema);
