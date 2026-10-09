const slugify = require('slugify');
const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getBlogs = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 9, all } = req.query;

  const filter = {};
  if (!(all === 'true' && req.user?.role === 'admin')) {
    filter.published = true;
  }

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
  const skip = (pageNum - 1) * limitNum;

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Blog.countDocuments(filter),
  ]);

  res.json({
    success: true,
    blogs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
    categories: Blog.CATEGORIES,
  });
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  if (!blog.published && req.user?.role !== 'admin') {
    throw new AppError('Blog not found', 404);
  }

  res.json({ success: true, blog });
});

const createBlog = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  let baseSlug = slugify(data.title || '', { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  data.slug = slug;
  data.authorId = req.user._id;
  data.authorName = req.user.name;
  data.published = data.published === 'true' || data.published === true;

  const blog = await Blog.create(data);
  res.status(201).json({ success: true, message: 'Blog created', blog });
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  const data = { ...req.body };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  if (data.title && data.title !== blog.title) {
    let baseSlug = slugify(data.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    data.slug = slug;
  }

  if (data.published === 'true') data.published = true;
  if (data.published === 'false') data.published = false;

  Object.assign(blog, data);
  await blog.save();

  res.json({ success: true, message: 'Blog updated', blog });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  await blog.deleteOne();
  res.json({ success: true, message: 'Blog deleted' });
});

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
