import React from 'react';
import './Navbar.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../../assets/logo3.png'; // Import the logo image
import { useCart } from '../../context/CartContext';
import { useSelector, useDispatch } from 'react-redux';
import { persistor } from '../../redux/store';
import { userLogout } from '../../services/userServices';
import { vendorLogout } from '../../services/vendorServices';
import { removeUser } from '../../redux/features/userSlice';
import { removeVendor } from '../../redux/features/vendorSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  
  const handleUserLogout = async () => {
    try {
      await userLogout();
      persistor.purge();
      dispatch(removeUser());
      clearCart();
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.log(error, "error from logout");
      // Even if logout fails, clear local state
      persistor.purge();
      dispatch(removeUser());
      clearCart();
      navigate('/');
    }
  };

  const handleVendorLogout = async () => {
    try {
      await vendorLogout();
      persistor.purge();
      dispatch(removeVendor());
      clearCart();
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.log(error, "error from vendor logout");
      // Even if logout fails, clear local state
      persistor.purge();
      dispatch(removeVendor());
      clearCart();
      navigate('/');
    }
  };

  const userData = useSelector((state) => state.user.user);
  const vendorData = useSelector((state) => state.vendor.vendor);
  console.log(userData, "user data from header");
  console.log(vendorData, "vendor data from header");
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Heritage Hands" className="logo-image" />
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/cart" className="nav-link cart-link">
            🛒 Cart
            <span className="cart-badge">{totalItems > 0 ? totalItems : ''}</span>
          </Link>
        </div>
        <div className="navbar-auth-section">
          {!vendorData && (
            <Link to="/vendorreg" className="nav-button">
              <span style={{ marginRight: "8px" }}>
                <i className="bi bi-shop"></i>
              </span>
              Become a Seller
            </Link>
          )}
          {vendorData && Object.keys(vendorData).length > 0 ? (
            <div className="user-welcome-section">
              <div className="button-group">
                <Link to="/vendordashboard" className='btn btn-primary btn-sm max-w-[-950px] rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white'>Dashboard</Link>
                <button className="btn btn-secondary btn-sm max-w-[-950px] rounded-2xl bg-gray-600 text-white ml-2" onClick={handleVendorLogout}>Logout</button>
              </div>
              <span className="welcome-text">Welcome {vendorData.name}</span>
            </div>
          ) : userData && Object.keys(userData).length > 0 ? (
            <div className="user-welcome-section">
              <div className="button-group">
                <Link to="/userdashboard" className='btn btn-primary btn-sm px-4 py-2 max-w-[-950px] rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white'>Dashboard</Link>
                <button className="btn btn-secondary btn-sm px-4 py-2 max-w-[-950px] rounded-2xl bg-gray-600 text-white ml-2" onClick={handleUserLogout}>Logout</button>
              </div>
              <span className="welcome-text">Welcome {userData.name}</span>
            </div>
          ) : (
            <div className="guest-auth-section">
              <div className="button-group">
                <Link to="/login" className='btn btn-secondary btn-sm'>Login</Link>
                <Link to="/vendorlog" className='btn btn-primary btn-sm'>Vendor Login</Link>
              </div>
              <span className="welcome-text">Welcome Guest</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
