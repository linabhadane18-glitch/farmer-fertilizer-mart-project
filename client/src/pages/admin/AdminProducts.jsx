import { useEffect, useState } from 'react';
import api, { formatINR, getImageUrl } from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';

const emptyForm = {
  name: '',
  description: '',
  category: 'Organic Fertilizers',
  subcategory: 'Vermicompost',
  price: '',
  brand: '',
  stock: '',
  unit: 'unit',
  image: '',
  safetyInformation: '',
  usageInstructions: '',
  ageRestriction: '',
  featured: false,
};

const SUBCATEGORIES = {
  Pesticides: ['Insecticides', 'Fungicides', 'Herbicides', 'Other Crop Protection'],
  'Organic Fertilizers': ['Vermicompost', 'Compost', 'Neem-based Fertilizers', 'Organic Manure'],
  Seeds: ['Vegetable Seeds', 'Fruit Seeds', 'Grain Seeds', 'Other Agricultural Seeds'],
  'Farming Tools': ['Sprayers', 'Gardening Tools', 'Hand Tools', 'Irrigation Equipment'],
};

const AdminProducts = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=50');
      setProducts(data.products || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'category') {
        next.subcategory = SUBCATEGORIES[value]?.[0] || '';
      }
      return next;
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, value);
      });
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/products/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated');
      } else {
        if (!imageFile && !form.image) {
          toast.error('Please provide an image URL or upload a file');
          setBusy(false);
          return;
        }
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      brand: p.brand,
      stock: p.stock,
      unit: p.unit || 'unit',
      image: p.image,
      safetyInformation: p.safetyInformation || '',
      usageInstructions: p.usageInstructions || '',
      ageRestriction: p.ageRestriction || '',
      featured: Boolean(p.featured),
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '1rem' }}>
        Product Management
      </h1>

      <form className="form-page" style={{ maxWidth: 'none', marginBottom: '1.5rem' }} onSubmit={onSubmit}>
        <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Name</label>
            <input name="name" required value={form.name} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input name="brand" required value={form.brand} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={onChange}>
              {Object.keys(SUBCATEGORIES).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Subcategory</label>
            <select name="subcategory" value={form.subcategory} onChange={onChange}>
              {(SUBCATEGORIES[form.category] || []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input name="price" type="number" min="0" required value={form.price} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" min="0" required value={form.stock} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input name="unit" value={form.unit} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Image URL (optional if uploading)</label>
            <input name="image" value={form.image} onChange={onChange} placeholder="https://..." />
          </div>
        </div>
        <div className="form-group">
          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows={3} required value={form.description} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Safety information</label>
          <textarea name="safetyInformation" rows={2} value={form.safetyInformation} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Usage instructions</label>
          <textarea name="usageInstructions" rows={2} value={form.usageInstructions} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Age / eligibility restrictions</label>
          <input name="ageRestriction" value={form.ageRestriction} onChange={onChange} />
        </div>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
          Featured on homepage
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-ghost" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={getImageUrl(p.image)}
                      alt=""
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatINR(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => editProduct(p)}>
                      Edit
                    </button>{' '}
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
