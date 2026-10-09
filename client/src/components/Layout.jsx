import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => (
  <div className="site-shell">
    <Navbar />
    <main className="site-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
