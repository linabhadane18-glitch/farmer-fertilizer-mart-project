const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.product');
  }
  return cart;
};

const formatCart = (cart) => {
  const items = (cart.items || [])
    .filter((item) => item.product)
    .map((item) => {
      const p = item.product;
      return {
        itemId: item._id,
        productId: p._id,
        name: p.name,
        image: p.image,
        brand: p.brand,
        category: p.category,
        price: p.price,
        stock: p.stock,
        quantity: item.quantity,
        lineTotal: p.price * item.quantity,
      };
    });

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

  return { items, itemCount, subtotal, total: subtotal };
};

const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json({ success: true, cart: formatCart(cart) });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < 1) {
    throw new AppError('Product is out of stock', 400);
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  const existing = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existing) {
    const newQty = existing.quantity + qty;
    if (newQty > product.stock) {
      throw new AppError(
        `Only ${product.stock} units available in stock`,
        400
      );
    }
    existing.quantity = newQty;
  } else {
    if (qty > product.stock) {
      throw new AppError(
        `Only ${product.stock} units available in stock`,
        400
      );
    }
    cart.items.push({ product: productId, quantity: qty });
  }

  await cart.save();
  const populated = await getOrCreateCart(req.user._id);

  res.status(201).json({
    success: true,
    message: 'Added to cart',
    cart: formatCart(populated),
  });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const qty = parseInt(quantity, 10);

  if (!qty || qty < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  const product = await Product.findById(item.product);
  if (!product || !product.isActive) {
    throw new AppError('Product no longer available', 400);
  }

  if (qty > product.stock) {
    throw new AppError(`Only ${product.stock} units available in stock`, 400);
  }

  item.quantity = qty;
  await cart.save();

  const populated = await getOrCreateCart(req.user._id);
  res.json({
    success: true,
    message: 'Cart updated',
    cart: formatCart(populated),
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new AppError('Cart item not found', 404);
  }

  item.deleteOne();
  await cart.save();

  const populated = await getOrCreateCart(req.user._id);
  res.json({
    success: true,
    message: 'Item removed',
    cart: formatCart(populated),
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({
    success: true,
    message: 'Cart cleared',
    cart: { items: [], itemCount: 0, subtotal: 0, total: 0 },
  });
});

const syncGuestCart = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    const cart = await getOrCreateCart(req.user._id);
    return res.json({ success: true, cart: formatCart(cart) });
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  for (const guestItem of items) {
    const product = await Product.findById(guestItem.productId);
    if (!product || !product.isActive || product.stock < 1) continue;

    const qty = Math.min(
      Math.max(1, parseInt(guestItem.quantity, 10) || 1),
      product.stock
    );

    const existing = cart.items.find(
      (i) => i.product.toString() === guestItem.productId
    );

    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock);
    } else {
      cart.items.push({ product: guestItem.productId, quantity: qty });
    }
  }

  await cart.save();
  const populated = await getOrCreateCart(req.user._id);
  res.json({ success: true, cart: formatCart(populated) });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncGuestCart,
};
