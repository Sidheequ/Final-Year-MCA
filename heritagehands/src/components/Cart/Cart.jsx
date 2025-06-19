import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Cart.css';

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
    // Here you would typically integrate with a payment processor
    alert('Proceeding to checkout...');
    clearCart();
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <section className="section-container">
        <div className="content-wrapper">
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <button onClick={() => navigate('/product')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
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
                  <h3>{item.title}</h3>
                  <p className="cart-item-price">${item.price}</p>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
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
              <button onClick={() => navigate('/product')} className="continue-shopping">
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