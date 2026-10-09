require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Cart = require('../models/Cart');
const { products, blogs } = require('./seedData');

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing products and blogs...');
    await Product.deleteMany({});
    await Blog.deleteMany({});

    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@farmersmart.com' });

    if (!admin) {
      const passwordHash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@12345',
        12
      );
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@farmersmart.com',
        mobile: process.env.ADMIN_MOBILE || '9999999999',
        passwordHash,
        role: 'admin',
      });
      await Cart.create({ userId: admin._id, items: [] });
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin already exists:', admin.email);
    }

    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products`);

    const blogDocs = blogs.map((b) => ({
      ...b,
      slug: b.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      authorId: admin._id,
      authorName: admin.name,
    }));

    const createdBlogs = await Blog.insertMany(blogDocs);
    console.log(`Inserted ${createdBlogs.length} blogs`);

    console.log('\nSeed completed successfully.');
    console.log('Admin login:');
    console.log(`  Email: ${admin.email}`);
    console.log('  Password: (value from ADMIN_PASSWORD in .env)');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
