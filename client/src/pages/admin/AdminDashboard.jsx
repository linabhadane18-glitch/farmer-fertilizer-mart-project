import { useEffect, useState } from 'react';
import api, { formatINR } from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.stats);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loader />;
  if (!stats) return <div className="alert alert-error">Unable to load dashboard.</div>;

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '1.25rem' }}>
        Admin Dashboard
      </h1>
      <div className="stat-grid">
        <div className="stat-card">
          <span>Registered Users</span>
          <strong>{stats.totalUsers}</strong>
        </div>
        <div className="stat-card">
          <span>Products</span>
          <strong>{stats.totalProducts}</strong>
        </div>
        <div className="stat-card">
          <span>Orders</span>
          <strong>{stats.totalOrders}</strong>
        </div>
        <div className="stat-card">
          <span>Published Blogs</span>
          <strong>{stats.totalBlogs}</strong>
        </div>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Stock by Category</h3>
      <div className="table-wrap" style={{ marginBottom: '1.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Products</th>
              <th>Total Stock</th>
            </tr>
          </thead>
          <tbody>
            {(stats.stockByCategory || []).map((row) => (
              <tr key={row._id}>
                <td>{row._id}</td>
                <td>{row.productCount}</td>
                <td>{row.totalStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Low Stock (≤ 10)</h3>
      <div className="table-wrap" style={{ marginBottom: '1.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {(stats.lowStock || []).map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
            {stats.lowStock?.length === 0 && (
              <tr>
                <td colSpan={3}>No low-stock products.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Recent Orders</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(stats.recentOrders || []).map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6)}</td>
                <td>{o.userId?.name || '—'}</td>
                <td>{formatINR(o.totalAmount)}</td>
                <td>
                  <span className="status-badge">{o.orderStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
