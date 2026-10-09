import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api, { formatINR } from '../services/api';
import Loader from '../components/Loader';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader message="Confirming order..." />;

  if (error || !order) {
    return (
      <div className="container empty-state">
        <p>{error || 'Order not found'}</p>
        <Link to="/orders" className="btn btn-primary">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: 640 }}>
      <div className="form-page" style={{ textAlign: 'center' }}>
        <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
        <h1>Order Confirmed</h1>
        <p>Your order has been saved successfully.</p>
        <p style={{ margin: '1rem 0' }}>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Status:</strong> <span className="status-badge">{order.orderStatus}</span>
        </p>
        <p>
          <strong>Total:</strong> {formatINR(order.totalAmount)}
        </p>
        <p>
          <strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Link to={`/orders`} className="btn btn-primary">
            My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
