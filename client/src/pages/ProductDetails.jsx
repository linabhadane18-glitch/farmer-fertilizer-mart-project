import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { formatINR, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setQty(1);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (loading) return <Loader message="Loading product..." />;
  if (!product) {
    return (
      <div className="container empty-state">
        <p>Product not found.</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const specs =
    product.specifications instanceof Map
      ? Object.fromEntries(product.specifications)
      : product.specifications || {};

  return (
    <div className="container product-detail">
      <div className="product-detail-image">
        <img src={getImageUrl(product.image)} alt={product.name} />
      </div>
      <div>
        <span className="pill">{product.category}</span>
        <h1 className="page-title" style={{ marginTop: '0.6rem' }}>
          {product.name}
        </h1>
        <p className="product-meta" style={{ margin: '0.5rem 0 1rem' }}>
          <span>Brand: {product.brand}</span>
          <span>{product.subcategory}</span>
        </p>
        <div className="product-price" style={{ fontSize: '1.6rem' }}>
          {formatINR(product.price)}
        </div>
        <p style={{ margin: '1rem 0', color: 'var(--muted)' }}>{product.description}</p>
        <p>
          <strong>Stock:</strong>{' '}
          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
        </p>
        <p>
          <strong>Unit:</strong> {product.unit}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1.2rem' }}>
          <div className="qty-control">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={busy || product.stock < 1}
          >
            {product.stock < 1 ? 'Out of Stock' : busy ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>

        {Object.keys(specs).length > 0 && (
          <div className="specs-list">
            <h3 style={{ marginTop: '1.5rem' }}>Specifications</h3>
            {Object.entries(specs).map(([key, value]) => (
              <div key={key}>
                <span>{key}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        )}

        {(product.safetyInformation || product.usageInstructions || product.ageRestriction) && (
          <div className="safety-box">
            <h4>Safety & Usage Information</h4>
            {product.safetyInformation && <p>{product.safetyInformation}</p>}
            {product.usageInstructions && (
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Usage:</strong> {product.usageInstructions}
              </p>
            )}
            {product.ageRestriction && (
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Eligibility:</strong> {product.ageRestriction}
              </p>
            )}
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem' }}>
              Always follow the product label and local agricultural regulations. This
              information does not replace official label instructions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
