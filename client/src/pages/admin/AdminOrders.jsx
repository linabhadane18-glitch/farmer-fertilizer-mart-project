import { useEffect, useState } from 'react';
import api, { formatINR } from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { orderStatus });
      toast.success('Order status updated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '1rem' }}>
        Order Management
      </h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>
                  <div>#{o._id.slice(-8)}</div>
                  <small>{new Date(o.createdAt).toLocaleString('en-IN')}</small>
                </td>
                <td>
                  <div>{o.userId?.name || o.shippingAddress?.fullName}</div>
                  <small>{o.userId?.email || o.shippingAddress?.mobile}</small>
                </td>
                <td>
                  {o.items.map((i) => (
                    <div key={`${o._id}-${i.name}`}>
                      {i.name} × {i.quantity}
                    </div>
                  ))}
                </td>
                <td>{formatINR(o.totalAmount)}</td>
                <td>
                  {o.paymentMethod} / {o.paymentStatus}
                </td>
                <td>
                  <span className="status-badge">{o.orderStatus}</span>
                </td>
                <td>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7}>No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
