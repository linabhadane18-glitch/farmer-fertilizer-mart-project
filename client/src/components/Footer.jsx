import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-grid">
      <div>
        <h4>Farmers Fertilizer Mart</h4>
        <p>
          Your trusted partner for fertilizers, seeds, farming tools, and crop-care
          products—built to serve farmers with clarity and care.
        </p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/weather">Weather</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </div>
      <div>
        <h4>Categories</h4>
        <ul>
          <li>
            <Link to="/products?category=Pesticides">Pesticides</Link>
          </li>
          <li>
            <Link to="/products?category=Organic Fertilizers">Organic Fertilizers</Link>
          </li>
          <li>
            <Link to="/products?category=Seeds">Seeds</Link>
          </li>
          <li>
            <Link to="/products?category=Farming Tools">Farming Tools</Link>
          </li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li>
            <Phone size={14} style={{ display: 'inline', marginRight: 6 }} />
            +91 98765 43210
          </li>
          <li>
            <Mail size={14} style={{ display: 'inline', marginRight: 6 }} />
            support@farmersmart.com
          </li>
          <li>
            <MapPin size={14} style={{ display: 'inline', marginRight: 6 }} />
            Agri Hub, Pune, Maharashtra
          </li>
        </ul>
      </div>
    </div>
    <div className="container footer-bottom">
      © {new Date().getFullYear()} Farmers Fertilizer Mart. All rights reserved.
    </div>
  </footer>
);

export default Footer;
