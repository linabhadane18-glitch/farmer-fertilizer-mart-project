import { useEffect, useState } from 'react';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';

const Blogs = () => {
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 9 });
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        const { data } = await api.get(`/blogs?${params}`);
        setBlogs(data.blogs || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
        setCategories(data.categories || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, category, page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Agricultural Blogs</h1>
          <p className="page-sub">Practical articles on farming, fertilizers, and crop care.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div className="filters-bar">
          <input
            type="search"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : blogs.length === 0 ? (
          <div className="empty-state">
            <p>No blog posts found.</p>
          </div>
        ) : (
          <>
            <div className="grid-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            <div className="pagination">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === page ? 'active' : ''}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Blogs;
