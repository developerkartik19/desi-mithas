import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // noop
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">D</span>
            <span className="logo-text">Desi Mithas</span>
          </Link>
          <nav className="nav">
            <ul className="nav-list">
              <li><NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink></li>
              <li><NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Profile</NavLink></li>
              <li><NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Orders</NavLink></li>
              {user?.role === 'admin' && <li><NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Admin</NavLink></li>}
            </ul>
          </nav>
          <div className="header-right">
            {user ? (
              <button className="shop-btn" onClick={handleLogout}>Sign out</button>
            ) : (
              <a className="shop-btn" href="#products">Explore sweets</a>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
