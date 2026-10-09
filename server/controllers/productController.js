const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    subcategory,
    sort,
    featured,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (featured === 'true') filter.featured = true;

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'name_asc') sortOption = { name: 1 };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
    categories: Product.CATEGORIES,
    subcategories: Product.SUBCATEGORIES,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }
  res.json({ success: true, product });
});

const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  if (typeof data.specifications === 'string') {
    try {
      data.specifications = JSON.parse(data.specifications);
    } catch {
      data.specifications = {};
    }
  }

  if (data.featured === 'true' || data.featured === true) data.featured = true;
  if (data.featured === 'false' || data.featured === false) data.featured = false;

  data.price = Number(data.price);
  data.stock = Number(data.stock);

  const product = await Product.create(data);
  res.status(201).json({ success: true, message: 'Product created', product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const data = { ...req.body };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  if (typeof data.specifications === 'string') {
    try {
      data.specifications = JSON.parse(data.specifications);
    } catch {
      /* keep existing */
    }
  }

  if (data.price !== undefined) data.price = Number(data.price);
  if (data.stock !== undefined) data.stock = Number(data.stock);
  if (data.featured === 'true') data.featured = true;
  if (data.featured === 'false') data.featured = false;

  Object.assign(product, data);
  await product.save();

  res.json({ success: true, message: 'Product updated', product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  product.isActive = false;
  await product.save();

  res.json({ success: true, message: 'Product deleted' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
