const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, products, orders, blogs, lowStock] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Blog.countDocuments({ published: true }),
    Product.find({ isActive: true, stock: { $lte: 10 } })
      .select('name stock category brand')
      .sort({ stock: 1 })
      .limit(20),
  ]);

  const stockAgg = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        totalStock: { $sum: '$stock' },
        productCount: { $sum: 1 },
      },
    },
  ]);

  const recentOrders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      totalUsers: users,
      totalProducts: products,
      totalOrders: orders,
      totalBlogs: blogs,
      stockByCategory: stockAgg,
      lowStock,
      recentOrders,
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { mobile: new RegExp(search, 'i') },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    users: users.map((u) => u.toSafeObject()),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === 'admin') {
    throw new AppError('Cannot modify administrator accounts this way', 403);
  }

  user.isActive = Boolean(isActive);
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
    user: user.toSafeObject(),
  });
});

module.exports = { getDashboardStats, getUsers, updateUserStatus };
