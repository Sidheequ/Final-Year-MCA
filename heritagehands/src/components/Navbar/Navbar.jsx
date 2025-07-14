import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../../assets/logo3.png'; // Import the logo image
import { useCart } from '../../context/CartContext';
import { useSelector, useDispatch } from 'react-redux';
import { persistor } from '../../redux/store';
import { userLogout, adminLogout } from '../../services/userServices';
import { vendorLogout } from '../../services/vendorServices';
import { removeUser } from '../../redux/features/userSlice';
import { removeVendor } from '../../redux/features/vendorSlice';
import { removeAdmin } from '../../redux/features/adminSlice';
import { FaUserCircle, FaBoxOpen, FaHeart, FaGift, FaStore, FaShoppingCart, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { FcAbout } from 'react-icons/fc';
import { MdOutlineContactPage } from 'react-icons/md';
import VendorNotificationBadge from '../VendorDashboard/VendorNotificationBadge'; // Adjust the path if needed

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const userData = useSelector((state) => state.user.user);
  const vendorData = useSelector((state) => state.vendor.vendor);
  const adminData = useSelector((state) => state.admin.admin);
  
  const isUserLoggedIn = userData && Object.keys(userData).length > 0;
  const isVendorLoggedIn = vendorData && Object.keys(vendorData).length > 0;
  const isAdminLoggedIn = adminData && Object.keys(adminData).length > 0;
  const isLoggedIn = isUserLoggedIn || isVendorLoggedIn || isAdminLoggedIn;

  const handleUserLogout = async () => {
    try {
      await userLogout();
    } finally {
      persistor.purge();
      dispatch(removeUser());
      clearCart();
      setDropdownOpen(false);
      navigate('/');
    }
  };

  const handleVendorLogout = async () => {
    try {
      await vendorLogout();
    } finally {
      persistor.purge();
      dispatch(removeVendor());
      clearCart();
      setDropdownOpen(false);
      navigate('/');
    }
  };

  const handleAdminLogout = async () => {
    try {
      await adminLogout();
    } finally {
      persistor.purge();
      dispatch(removeAdmin());
      clearCart();
      setDropdownOpen(false);
      navigate('/');
    }
  };

  const handleLogout = () => {
    if (isUserLoggedIn) {
      handleUserLogout();
    } else if (isVendorLoggedIn) {
      handleVendorLogout();
    } else if (isAdminLoggedIn) {
      handleAdminLogout();
    }
  };

  const getDisplayName = () => {
    if (isUserLoggedIn) {
      return userData.name;
    } else if (isVendorLoggedIn) {
      return vendorData.name;
    } else if (isAdminLoggedIn) {
      return adminData.name || 'Admin';
    }
    return 'Login';
  };

  const getDashboardLink = () => {
    if (isUserLoggedIn) {
      return '/userdashboard';
    } else if (isVendorLoggedIn) {
      return '/vendordashboard';
    } else if (isAdminLoggedIn) {
      return '/admindashboard';
    }
    return '/login';
  };

  const getDashboardIcon = () => {
    if (isUserLoggedIn) {
      return <FaUserCircle />;
    } else if (isVendorLoggedIn) {
      return <FaStore />;
    } else if (isAdminLoggedIn) {
      return <FaUserShield />;
    }
    return <FaUserCircle />;
  };

  const getDashboardText = () => {
    if (isUserLoggedIn) {
      return 'User Dashboard';
    } else if (isVendorLoggedIn) {
      return 'Vendor Dashboard';
    } else if (isAdminLoggedIn) {
      return 'Admin Dashboard';
    }
    return 'Login';
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLinkClick = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Heritage Hands" className="logo-image" />
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
        </div>
        <div className="navbar-actions">
          {/* {isVendorLoggedIn && (
             <VendorNotificationBadge />
          )} */}
          <div 
            className="dropdown-container"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="nav-button user-button">
              <FaUserCircle /> 
              {isLoggedIn ? ` ${getDisplayName()}` : ' Login'}
              <span className="dropdown-arrow">{dropdownOpen ? ' ▲' : ' ▼'}</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {isLoggedIn ? (
                  <Link to={getDashboardLink()} className="dropdown-item" onClick={handleLinkClick}>
                    {getDashboardIcon()} {getDashboardText()}
                  </Link>
                ) : (
                  <Link to="/login" className="dropdown-item" onClick={handleLinkClick}>
                    <FaUserCircle /> Login
                  </Link>
                )}
                
                {!isLoggedIn && (
                  <div className="dropdown-item new-customer">
                    <span>New customer?</span>
                    <Link to="/signup" className="signup-link" onClick={handleLinkClick}>Sign Up</Link>
                  </div>
                )}

                <div className="dropdown-divider"></div>

                <Link to={isLoggedIn ? "/orders" : "/login"} className="dropdown-item" onClick={handleLinkClick}>
                  <FaBoxOpen /> Orders
                </Link>
                <Link to="/cart" className="dropdown-item" onClick={handleLinkClick}>
                  <FaShoppingCart /> Cart
                </Link>
                <Link to="/about" className="dropdown-item" onClick={handleLinkClick}>
                  <FcAbout /> About
                </Link>
                <Link to="/contact" className="dropdown-item" onClick={handleLinkClick}>
                  <MdOutlineContactPage /> Contact
                </Link>
                
                {isLoggedIn && (
                  <button onClick={handleLogout} className="dropdown-item logout-button">
                    <FaSignOutAlt /> Logout
                  </button>
                )}
              </div>
            )}
          </div>
          
          {!isVendorLoggedIn && !isAdminLoggedIn && (
            <Link to="/vendorlog" className="nav-button">
              <FaStore /> Become a Seller
            </Link>
          )}
          
          <Link to="/cart" className="nav-link cart-link">
            <FaShoppingCart /> Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
