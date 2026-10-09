import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { formatINR } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod: 'COD',
      });
      await refreshCart();
      toast.success('Order placed successfully');
      navigate(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!cart.items?.length) {
    return (
      <div className="container empty-state">
        <p>Your cart is empty. Add products before checkout.</p>
        <Link to="/products" className="btn btn-primary">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Checkout</h1>
          <p className="page-sub">Cash on Delivery · Secure order confirmation</p>
        </div>
      </div>

      <div className="container cart-layout">
        <form onSubmit={onSubmit} className="form-page" style={{ margin: 0, maxWidth: 'none' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>
            Delivery Details
          </h2>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="fullName">Customer name</label>
            <input id="fullName" name="fullName" required value={form.fullName} onChange={onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile number</label>
            <input id="mobile" name="mobile" required value={form.mobile} onChange={onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="address">Delivery address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              value={form.address}
              onChange={onChange}
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" required value={form.city} onChange={onChange} />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input id="state" name="state" required value={form.state} onChange={onChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pinCode">PIN code</label>
            <input id="pinCode" name="pinCode" required value={form.pinCode} onChange={onChange} />
          </div>
          <div className="alert alert-info">Payment method: Cash on Delivery (COD)</div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Placing order…' : 'Confirm Order'}
          </button>
        </form>

        <aside className="cart-summary">
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          {cart.items.map((item) => (
            <div className="summary-row" key={item.itemId}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatINR(item.lineTotal)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatINR(cart.total)}</span>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Checkout;
