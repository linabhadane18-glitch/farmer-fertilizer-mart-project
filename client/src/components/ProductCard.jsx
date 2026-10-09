import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatINR, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  const handleAdd = async () => {
    setBusy(true);
    try {
      await addToCart(product._id, qty);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="product-card">
      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        className="product-card-image"
        loading="lazy"
      />
      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.brand}</span>
        </div>
        <h3>{product.name}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          {(product.description || '').slice(0, 90)}
          {product.description?.length > 90 ? '…' : ''}
        </p>
        <div className="product-price">{formatINR(product.price)}</div>
        <div className="product-meta">
          <span>Stock: {product.stock}</span>
          <span>{product.unit}</span>
        </div>
        <div className="qty-control" style={{ width: 'fit-content' }}>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span>{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div className="product-actions">
          <Link to={`/products/${product._id}`} className="btn btn-secondary btn-sm">
            Details
          </Link>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={busy || product.stock < 1}
          >
            {product.stock < 1 ? 'Out of Stock' : busy ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
