import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formatINR, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const changeQty = async (itemId, quantity, stock) => {
    if (quantity < 1) return;
    if (quantity > stock) {
      toast.error(`Only ${stock} units available`);
      return;
    }
    try {
      await updateQuantity(itemId, quantity);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader message="Loading cart..." />;

  if (!cart.items?.length) {
    return (
      <div className="container empty-state">
        <ShoppingBag size={56} />
        <h2>Your cart is empty</h2>
        <p>Browse products and add what your farm needs.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-sub">{cart.itemCount} item(s) in your cart</p>
        </div>
      </div>

      <div className="container cart-layout">
        <div>
          {cart.items.map((item) => (
            <div className="cart-item" key={item.itemId}>
              <img src={getImageUrl(item.image)} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  {item.brand} · {formatINR(item.price)} each
                </p>
                <div className="qty-control" style={{ marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => changeQty(item.itemId, item.quantity - 1, item.stock)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => changeQty(item.itemId, item.quantity + 1, item.stock)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-actions" style={{ textAlign: 'right' }}>
                <strong>{formatINR(item.lineTotal)}</strong>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  style={{ display: 'block', marginTop: '0.6rem' }}
                  onClick={() => removeItem(item.itemId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <Link to="/products" className="btn btn-ghost">
            ← Continue Shopping
          </Link>
        </div>

        <aside className="cart-summary">
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatINR(cart.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatINR(cart.total)}</span>
          </div>
          {!isAuthenticated && (
            <p className="alert alert-info" style={{ marginTop: '1rem' }}>
              Please <Link to="/login">log in</Link> to checkout. Your guest cart will sync
              after login.
            </p>
          )}
          <Link
            to={isAuthenticated ? '/checkout' : '/login'}
            className="btn btn-primary btn-block"
            style={{ marginTop: '1rem' }}
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </>
  );
};

export default Cart;
