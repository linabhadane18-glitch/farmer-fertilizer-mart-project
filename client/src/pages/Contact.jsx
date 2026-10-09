import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-sub">We are here to help with orders, products, and account questions.</p>
        </div>
      </div>
      <div className="container grid-2" style={{ padding: '2rem 0 3rem', alignItems: 'start' }}>
        <div>
          <div className="benefit-item" style={{ marginBottom: '1rem' }}>
            <Phone color="var(--green-700)" />
            <h3>Phone</h3>
            <p>+91 98765 43210</p>
          </div>
          <div className="benefit-item" style={{ marginBottom: '1rem' }}>
            <Mail color="var(--green-700)" />
            <h3>Email</h3>
            <p>support@farmersmart.com</p>
          </div>
          <div className="benefit-item">
            <MapPin color="var(--green-700)" />
            <h3>Address</h3>
            <p>Agri Hub, Pune, Maharashtra, India</p>
          </div>
        </div>
        <form className="form-page" style={{ margin: 0 }} onSubmit={onSubmit}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Send a Message</h2>
          {sent && (
            <div className="alert alert-success">
              Thanks! Your message has been noted. For order issues, include your Order ID.
            </div>
          )}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Send Message
          </button>
        </form>
      </div>
    </>
  );
};

export default Contact;
