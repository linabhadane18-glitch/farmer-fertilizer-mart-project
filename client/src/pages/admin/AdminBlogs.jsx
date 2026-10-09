import { useEffect, useState } from 'react';
import api from '../../services/api';
import Loader from '../../components/Loader';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Organic Farming',
  'Fertilizer Management',
  'Crop Protection',
  'Seed Selection',
  'Modern Farming Technology',
  'Sustainable Agriculture',
];

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: CATEGORIES[0],
  image: '',
  published: true,
};

const AdminBlogs = () => {
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/blogs?all=true&limit=50');
      setBlogs(data.blogs || []);
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
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/blogs/${editingId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Blog updated');
      } else {
        if (!imageFile && !form.image) {
          toast.error('Please provide an image URL or upload a file');
          setBusy(false);
          return;
        }
        await api.post('/blogs', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Blog created');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const editBlog = (b) => {
    setEditingId(b._id);
    setForm({
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      category: b.category,
      image: b.image,
      published: b.published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const togglePublish = async (blog) => {
    try {
      const fd = new FormData();
      fd.append('published', (!blog.published).toString());
      await api.put(`/blogs/${blog._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(blog.published ? 'Unpublished' : 'Published');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '1rem' }}>
        Blog Management
      </h1>

      <form className="form-page" style={{ maxWidth: 'none', marginBottom: '1.5rem' }} onSubmit={onSubmit}>
        <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Blog' : 'Create Blog'}</h3>
        <div className="form-group">
          <label>Title</label>
          <input name="title" required value={form.title} onChange={onChange} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input name="image" value={form.image} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
        <div className="form-group">
          <label>Short description</label>
          <textarea name="excerpt" rows={2} required value={form.excerpt} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Full content</label>
          <textarea name="content" rows={6} required value={form.content} onChange={onChange} />
        </div>
        <label style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input type="checkbox" name="published" checked={form.published} onChange={onChange} />
          Published
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : editingId ? 'Update Blog' : 'Create Blog'}
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
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id}>
                  <td>{b.title}</td>
                  <td>{b.category}</td>
                  <td>
                    <span className="status-badge">{b.published ? 'published' : 'draft'}</span>
                  </td>
                  <td>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => editBlog(b)}>
                      Edit
                    </button>{' '}
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => togglePublish(b)}>
                      {b.published ? 'Unpublish' : 'Publish'}
                    </button>{' '}
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteBlog(b._id)}>
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

export default AdminBlogs;
