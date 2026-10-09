import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const sort = searchParams.get('sort') || '';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (subcategory) params.set('subcategory', subcategory);
        if (sort) params.set('sort', sort);
        params.set('page', page);
        params.set('limit', '12');

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
        setSubcategories(data.subcategories || {});
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, category, subcategory, sort, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    if (key === 'category') next.delete('subcategory');
    setSearchParams(next);
  };

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Agricultural Products</h1>
          <p className="page-sub">
            Browse pesticides, organic fertilizers, seeds, and farming tools.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="filters-bar">
          <input
            type="search"
            placeholder="Search products..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('search', e.target.value.trim());
            }}
          />
          <select value={category} onChange={(e) => updateParam('category', e.target.value)}>
            <option value="">All Categories</option>
            <option value="Pesticides">Pesticides</option>
            <option value="Organic Fertilizers">Organic Fertilizers</option>
            <option value="Seeds">Seeds</option>
            <option value="Farming Tools">Farming Tools</option>
          </select>
          <select
            value={subcategory}
            onChange={(e) => updateParam('subcategory', e.target.value)}
            disabled={!category}
          >
            <option value="">All Subcategories</option>
            {(subcategories[category] || []).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name A–Z</option>
          </select>
        </div>

        {loading ? (
          <Loader message="Loading products..." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              Showing {products.length} of {pagination.total} products
            </p>
            <div className="grid-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className="pagination">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => updateParam('page', String(pagination.page - 1))}
              >
                Prev
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === pagination.page ? 'active' : ''}
                  onClick={() => updateParam('page', String(n))}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={pagination.page >= pagination.pages}
                onClick={() => updateParam('page', String(pagination.page + 1))}
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

export default Products;
