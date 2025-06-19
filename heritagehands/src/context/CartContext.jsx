import React, { createContext, useContext, useState } from 'react';
import { addProductToCart, fetchUserCart } from '../services/userServices';
import { useSelector } from 'react-redux';
import LoadingAnimation from '../components/Cart/LoadingAnimation';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const userData = useSelector((state) => state.user.user);
  const vendorData = useSelector((state) => state.vendor.vendor);

  // Fetch cart from backend for logged-in user
  const fetchCart = async () => {
    if (userData && Object.keys(userData).length > 0) {
      try {
        const res = await fetchUserCart();
        // Map backend cart products to frontend cartItems
        if (res.data && res.data.products) {
          setCartItems(
            res.data.products.map(item => ({
              id: item.productId._id || item.productId, // fallback if not populated
              title: item.productId.title,
              image: item.productId.image,
              price: item.price,
              quantity: item.quantity,
              category: item.productId.category,
              description: item.productId.description,
            }))
          );
        } else {
          setCartItems([]);
        }
      } catch (error) {
        setCartItems([]);
      }
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (userData && Object.keys(userData).length > 0) {
      // Logged-in user: call backend
      try {
        await addProductToCart(product._id || product.id, quantity);
        alert('Product added to cart!');
        await fetchCart(); // Sync cart after adding
      } catch (error) {
        alert(
          error?.response?.data?.message || 'Failed to add product to cart.'
        );
      }
    } else if (vendorData && Object.keys(vendorData).length > 0) {
      // Vendor logged in: block add to cart
      alert('Vendors cannot add products to the cart.');
    } else {
      // Guest: show offline modal
      setShowOfflineModal(true);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Modal for offline/guest cart
  const OfflineCartModal = () => {
    const { useNavigate } = require('react-router-dom');
    const navigate = useNavigate();
    return (
      <div className="offline-cart-modal-overlay">
        <div className="offline-cart-modal">
          <LoadingAnimation />
          <h2 style={{ textAlign: 'center', margin: '1.5rem 0 0.5rem 0' }}>Missing Cart Items?</h2>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '1.5rem' }}>
            Please log in to your account to add products to your cart and keep your items safe.
          </p>
          <button
            className="offline-cart-login-btn"
            onClick={() => {
              setShowOfflineModal(false);
              navigate('/login');
            }}
          >
            Login to Continue
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span
              className="offline-cart-continue-link"
              style={{ color: '#6366f1', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => {
                setShowOfflineModal(false);
                navigate('/');
              }}
            >
              Continue Shopping
            </span>
          </div>
        </div>
      </div>
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {showOfflineModal && <OfflineCartModal />}
    </CartContext.Provider>
  );
}; 