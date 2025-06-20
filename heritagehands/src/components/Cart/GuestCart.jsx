import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GuestCart.css';
import Loader from './Loader';

const GuestCart = () => {
  const navigate = useNavigate();

  const handleMissedCartClick = () => {
    navigate('/login');
  };

  return (
    <div className="guest-cart-container">
      <div className="animation-container">
        <Loader />
      </div>
      
      <div className="guest-cart-content">
        <h2>Oops! You need to be logged in to view your cart</h2>
        <p>Please log in to access your shopping cart and continue shopping.</p>
        
        <div className="guest-cart-actions">
          <button className="missed-cart-btn" onClick={handleMissedCartClick}>
            Missed your cart items?
          </button>
          <Link to="/" className="home-link">
            Continue to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestCart; 