import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Cart.css';
import LoadingAnimation from './LoadingAnimation';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      fetchCart();
    }
    // eslint-disable-next-line
  }, [userData]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <section className="section-container">
        <div className="cart-empty-container">
          <LoadingAnimation />
          <h2 className="cart-empty-title">Your cart is empty</h2>
          <p className="cart-empty-message">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container">
      <div className="content-wrapper">
        <div className="cart-container">
          <h2>Your Cart</h2>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title}</h3>
                  {item.category && (
                    <p className="cart-item-category">
                      <span className="category-label">Category:</span> {item.category}
                    </p>
                  )}
                  {item.description && (
                    <p className="cart-item-description">
                      {item.description.length > 100 
                        ? `${item.description.substring(0, 100)}...` 
                        : item.description
                      }
                    </p>
                  )}
                  <p className="cart-item-price">${item.price}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="cart-actions">
              <button onClick={() => navigate('/')} className="continue-shopping-link">
                Continue Shopping
              </button>
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;