import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
];

const AdminLayout = () => (
  <div className="admin-layout">
    <aside className="admin-sidebar">
      <h3 style={{ color: 'white', marginBottom: '1rem', paddingLeft: '0.5rem' }}>Admin</h3>
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end}>
          {link.label}
        </NavLink>
      ))}
    </aside>
    <div className="admin-content">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
