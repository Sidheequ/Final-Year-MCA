import React from 'react';
import { FaUserCircle, FaBoxOpen, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import './UserDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { persistor } from '../../redux/store';
import { userLogout } from '../../services/userServices';
import { removeUser } from '../../redux/features/userSlice';
import { useCart } from '../../context/CartContext';

const UserSidebar = ({ user, activeView, setActiveView }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleLogout = async () => {
    try {
      await userLogout();
      persistor.purge();
      dispatch(removeUser());
      clearCart();
      navigate('/');
    } catch (error) {
      console.log("Error during logout:", error);
      // Even if logout fails, clear local state
      persistor.purge();
      dispatch(removeUser());
      clearCart();
      navigate('/');
    }
  };

  const navItems = [
    { key: 'account', icon: <FaUserCircle />, label: 'Account' },
    { key: 'orders', icon: <FaBoxOpen />, label: 'Orders' },
    { key: 'cart', icon: <FaShoppingCart />, label: 'Cart', path: '/cart' },
  ];

  return (
    <aside className="user-sidebar">
      <div className="sidebar-header">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h3 className="user-name">{user?.name || 'User'}</h3>
        <p className="user-email">{user?.email || 'user@example.com'}</p>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          if (item.path) {
            return (
              <Link key={item.key} to={item.path} className="sidebar-link">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          }
          return (
            <button
              key={item.key}
              className={`sidebar-link ${activeView === item.key ? 'active' : ''}`}
              onClick={() => setActiveView(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar; 