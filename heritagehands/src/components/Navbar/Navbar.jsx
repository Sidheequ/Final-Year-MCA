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

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleUserLogout = () => {
    try {
      userLogout().then((res) => {
        persistor.purge();
        dispatch(removeUser());
        navigate('/'); // Redirect to homepage
      });
    } catch (error) {
      console.log(error, "error from logout");
    }
  };

  const handleVendorLogout = () => {
    try {
      vendorLogout().then((res) => {
        persistor.purge();
        dispatch(removeVendor());
        navigate('/'); // Redirect to homepage
      });
    } catch (error) {
      console.log(error, "error from vendor logout");
    }
  };

  const userData = useSelector((state) => state.user.user);
  const vendorData = useSelector((state) => state.vendor.vendor);
  console.log(userData, "user data from header");
  console.log(vendorData, "vendor data from header");
  
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="logo" style={{ width: "200px", height: "80px", objectFit: "contain" }} />
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/product" className="nav-link">Products</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        {!vendorData && (
          <Link to="/cart" className="nav-link cart-link">
            <span style={{ marginRight: "8px", position: "relative" }}>
              <i className="bi bi-cart"></i>
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </span>
            Cart
          </Link>
        )}
        {!vendorData && (
          <Link to="/vendorreg" className="nav-link">
            <span style={{ marginRight: "8px" }}>
              <i className="bi bi-shop"></i>
            </span>
            Become a Seller
          </Link>
        )}
      </div>

      {vendorData && Object.keys(vendorData).length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className='text-black'>Welcome {vendorData.name}</span>
          <Link to="/vendordashboard" className='btn btn-primary btn-sm'>Dashboard</Link>
          <button className="btn btn-secondary btn-sm" onClick={handleVendorLogout}>Logout</button>
        </div>
      ) : userData && Object.keys(userData).length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className='text-black'>Welcome {userData.name}</span>
          <Link to="/userdashboard" className='btn btn-primary btn-sm'>Dashboard</Link>
          <button className="btn btn-secondary btn-sm" onClick={handleUserLogout}>Logout</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className='btn btn-secondary'>Login</Link>
          <Link to="/vendorlog" className='btn btn-primary'>Vendor Login</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
