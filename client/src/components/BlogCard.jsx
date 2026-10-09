import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const BlogCard = ({ blog }) => (
  <article className="blog-card">
    <img src={getImageUrl(blog.image)} alt={blog.title} loading="lazy" />
    <div className="blog-card-body">
      <span className="pill">{blog.category}</span>
      <h3>{blog.title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{blog.excerpt}</p>
      <div className="product-meta">
        <span>{blog.authorName}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString('en-IN')}</span>
      </div>
      <Link to={`/blogs/${blog.slug}`} className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
        Read More
      </Link>
    </div>
  </article>
);

export default BlogCard;
