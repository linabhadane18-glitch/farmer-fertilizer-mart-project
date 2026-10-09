require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Cart = require('../models/Cart');

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME || 'Admin User';
    const email = (process.env.ADMIN_EMAIL || 'admin@farmersmart.com').toLowerCase();
    const mobile = process.env.ADMIN_MOBILE || '9999999999';
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`Updated existing user ${email} to admin role.`);
      } else {
        console.log(`Admin already exists: ${email}`);
      }
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await User.create({
      name,
      email,
      mobile,
      passwordHash,
      role: 'admin',
    });

    await Cart.create({ userId: admin._id, items: [] });

    console.log('Administrator created successfully.');
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log('  Password: (from ADMIN_PASSWORD in server/.env)');
    console.log('\nChange the default password after first login in production.');
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
