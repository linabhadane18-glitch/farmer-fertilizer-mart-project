import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import Loader from '../components/Loader';

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/blogs/${slug}`);
        setBlog(data.blog);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <Loader />;
  if (error || !blog) {
    return (
      <div className="container empty-state">
        <p>{error || 'Blog not found'}</p>
        <Link to="/blogs" className="btn btn-primary">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="container blog-article">
      <span className="pill">{blog.category}</span>
      <h1 className="page-title" style={{ marginTop: '0.75rem' }}>
        {blog.title}
      </h1>
      <p className="page-sub">
        By {blog.authorName} · {new Date(blog.createdAt).toLocaleDateString('en-IN')}
      </p>
      <img className="featured" src={getImageUrl(blog.image)} alt={blog.title} />
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>{blog.excerpt}</p>
      <div className="content">{blog.content}</div>
      <Link to="/blogs" className="btn btn-secondary" style={{ marginTop: '2rem' }}>
        ← All Blogs
      </Link>
    </article>
  );
};

export default BlogDetails;
