const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const buildOrderFromCart = async (userId, shippingAddress, paymentMethod, session = null) => {
  const cartQuery = Cart.findOne({ userId }).populate('items.product');
  if (session) cartQuery.session(session);
  const cart = await cartQuery;

  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty', 400);
  }

  const orderItems = [];
  let subtotal = 0;
  const reserved = [];

  try {
    for (const item of cart.items) {
      const productId = item.product._id || item.product;
      const findOpts = session ? { session } : {};
      const product = await Product.findById(productId, null, findOpts);

      if (!product || !product.isActive) {
        throw new AppError('One or more products are unavailable', 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          400
        );
      }

      const updateOpts = { new: true };
      if (session) updateOpts.session = session;

      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        updateOpts
      );

      if (!updated) {
        throw new AppError(`Could not reserve stock for ${product.name}`, 400);
      }

      reserved.push({ productId: product._id, quantity: item.quantity });
      subtotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        brand: product.brand,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const orderData = {
      userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      totalAmount: subtotal,
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      statusHistory: [
        { status: 'confirmed', note: 'Order placed successfully', updatedAt: new Date() },
      ],
    };

    let order;
    if (session) {
      const created = await Order.create([orderData], { session });
      order = created[0];
    } else {
      order = await Order.create(orderData);
    }

    cart.items = [];
    await cart.save(session ? { session } : undefined);

    return order;
  } catch (error) {
    // Roll back reserved stock if we were not inside a DB transaction
    if (!session && reserved.length) {
      for (const r of reserved) {
        await Product.findByIdAndUpdate(r.productId, { $inc: { stock: r.quantity } });
      }
    }
    throw error;
  }
};

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD' } = req.body;

  if (!shippingAddress) {
    throw new AppError('Shipping address is required', 400);
  }

  // Prefer transactions when supported (replica set). Fall back for standalone MongoDB.
  const session = await mongoose.startSession();
  let order;

  try {
    session.startTransaction();
    order = await buildOrderFromCart(req.user._id, shippingAddress, paymentMethod, session);
    await session.commitTransaction();
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch {
      /* ignore */
    }

    const needsFallback =
      error.message?.includes('Transaction numbers') ||
      error.message?.includes('replica set') ||
      error.code === 20 ||
      error.codeName === 'IllegalOperation';

    if (needsFallback) {
      order = await buildOrderFromCart(req.user._id, shippingAddress, paymentMethod, null);
    } else {
      throw error;
    }
  } finally {
    session.endSession();
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (
    order.userId.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.json({ success: true, order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.orderStatus = status;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, note } = req.body;
  const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!allowed.includes(orderStatus)) {
    throw new AppError('Invalid order status', 400);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  order.orderStatus = orderStatus;
  if (orderStatus === 'delivered') {
    order.paymentStatus = 'paid';
  }
  order.statusHistory.push({
    status: orderStatus,
    note: note || `Status updated to ${orderStatus}`,
    updatedAt: new Date(),
  });

  await order.save();

  res.json({ success: true, message: 'Order status updated', order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
