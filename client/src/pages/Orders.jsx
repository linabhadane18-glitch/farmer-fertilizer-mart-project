import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { formatINR } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';

const Orders = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.orders || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loader message="Loading orders..." />;

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">My Orders</h1>
          <p className="page-sub">Track your previous and current orders.</p>
        </div>
      </div>
      <div className="container" style={{ padding: '1.5rem 0 3rem' }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>You have not placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="status-badge">{order.orderStatus}</span>
              </div>
              <p style={{ margin: '0.75rem 0' }}>
                {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{formatINR(order.totalAmount)}</strong>
                <Link to={`/order-confirmation/${order._id}`} className="btn btn-secondary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Orders;
