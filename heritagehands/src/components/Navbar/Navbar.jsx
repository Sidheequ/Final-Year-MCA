import React from 'react';
import './Navbar.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../../assets/logo3.png'; // Import the logo image
import { useCart } from '../../context/CartContext';

function Navbar() {
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
        <Link to="/cart" className="nav-link cart-link">
          <span style={{ marginRight: "8px", position: "relative" }}>
            <i className="bi bi-cart"></i>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </span>
          Cart
        </Link>
        <Link to="/vendorlog" className="nav-link">
          <span style={{ marginRight: "8px" }}>
            <i className="bi bi-shop"></i>
          </span>
          Become a Seller
        </Link>
      </div>

      <Link to="/login">
        <button className="nav-button">
          Login
          <svg
            fill="white"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </Link>
    </nav>
  );
}

export default Navbar;
