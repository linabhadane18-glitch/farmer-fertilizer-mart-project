import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  Leaf,
  Package,
  ShieldCheck,
  Sprout,
  Truck,
  Wrench,
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';

const categories = [
  {
    name: 'Pesticides',
    desc: 'Crop protection products with clear safety guidance',
    icon: ShieldCheck,
    to: '/products?category=Pesticides',
  },
  {
    name: 'Organic Fertilizers',
    desc: 'Compost, vermicompost, and neem-based nutrition',
    icon: Sprout,
    to: '/products?category=Organic Fertilizers',
  },
  {
    name: 'Seeds',
    desc: 'Vegetable, fruit, and grain seed packs',
    icon: Leaf,
    to: '/products?category=Seeds',
  },
  {
    name: 'Farming Tools',
    desc: 'Sprayers, hand tools, and irrigation kits',
    icon: Wrench,
    to: '/products?category=Farming Tools',
  },
];

const Home = () => {
  const toast = useToast();
  const [featured, setFeatured] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, blogRes] = await Promise.all([
          api.get('/products?featured=true&limit=4'),
          api.get('/blogs?limit=3'),
        ]);
        setFeatured(prodRes.data.products || []);
        setBlogs(blogRes.data.blogs || []);

        try {
          const w = await api.get('/weather?city=Pune');
          setWeather(w.data.weather);
        } catch {
          setWeather(null);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const subscribe = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/newsletter/subscribe', { email });
      setSubMsg(data.message);
      setEmail('');
    } catch (err) {
      setSubMsg(err.message);
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-brand">Farmers Fertilizer Mart</div>
          <h1>Grow Better, Harvest More!</h1>
          <p>Your Trusted Partner for Smart and Sustainable Farming.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Shop by Category</h2>
              <p>Everything your farm needs, organized simply.</p>
            </div>
          </div>
          <div className="grid-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} to={cat.to} className="category-tile">
                  <span className="category-icon">
                    <Icon size={22} />
                  </span>
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-beige">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p>Popular picks trusted by farmers.</p>
            </div>
            <Link to="/products" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid-4">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="weather-card">
            <div className="section-header" style={{ marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Weather Preview</h2>
                <p>Plan fieldwork with local conditions.</p>
              </div>
              <CloudSun color="var(--green-700)" />
            </div>
            {weather ? (
              <>
                <div className="weather-main">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    width={72}
                    height={72}
                  />
                  <div>
                    <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
                    <strong>
                      {weather.city}, {weather.country}
                    </strong>
                    <p style={{ textTransform: 'capitalize', color: 'var(--muted)' }}>
                      {weather.description}
                    </p>
                  </div>
                </div>
                <Link to="/weather" className="btn btn-primary btn-sm">
                  Open Weather Dashboard
                </Link>
              </>
            ) : (
              <div className="alert alert-info">
                Weather preview is unavailable. Add an OpenWeather API key on the
                server, then open the Weather page to search any city.
              </div>
            )}
          </div>

          <div>
            <div className="section-header">
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Why Shop With Us</h2>
                <p>Clear products. Reliable delivery. Farmer-first support.</p>
              </div>
            </div>
            <div className="grid-2">
              <div className="benefit-item">
                <Package color="var(--green-700)" />
                <h3>Quality Products</h3>
                <p>Curated fertilizers, seeds, tools, and crop-care items.</p>
              </div>
              <div className="benefit-item">
                <Truck color="var(--green-700)" />
                <h3>Cash on Delivery</h3>
                <p>Order online and pay when your package arrives.</p>
              </div>
              <div className="benefit-item">
                <ShieldCheck color="var(--green-700)" />
                <h3>Safety Guidance</h3>
                <p>Clear usage notes on crop-protection products.</p>
              </div>
              <div className="benefit-item">
                <Leaf color="var(--green-700)" />
                <h3>Farming Knowledge</h3>
                <p>Practical blogs and weather tools for better decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-beige">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Latest From Our Blog</h2>
              <p>Practical farming tips in plain language.</p>
            </div>
            <Link to="/blogs" className="btn btn-secondary btn-sm">
              All Blogs
            </Link>
          </div>
          <div className="grid-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>What Farmers Say</h2>
              <p>Stories from growers who shop with us.</p>
            </div>
          </div>
          <div className="grid-3">
            <blockquote className="testimonial">
              <p>
                “Ordering vermicompost and seeds online saved me a trip to town.
                Delivery was on time.”
              </p>
              <strong>— Ramesh Patel, Gujarat</strong>
            </blockquote>
            <blockquote className="testimonial">
              <p>
                “The product pages explain safety clearly. That helped me choose the
                right sprayer and spray carefully.”
              </p>
              <strong>— Sunita Devi, Bihar</strong>
            </blockquote>
            <blockquote className="testimonial">
              <p>
                “I check the weather page before planning irrigation. Simple and
                useful for our small farm.”
              </p>
              <strong>— Anil Kumar, Maharashtra</strong>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="newsletter">
            <div>
              <h2>Stay Updated With Farming Tips</h2>
              <p>
                Subscribe for product updates and seasonal agriculture notes. No spam.
              </p>
            </div>
            <form className="newsletter-form" onSubmit={subscribe}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                Subscribe
              </button>
            </form>
            {subMsg && <p style={{ gridColumn: '1 / -1' }}>{subMsg}</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
