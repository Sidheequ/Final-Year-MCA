import React, { createContext, useContext, useState, useEffect } from 'react';
import { addProductToCart, fetchUserCart, removeFromCart as removeFromCartService, updateCartItemQuantity as updateCartItemQuantityService } from '../services/userServices';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../components/Cart/LoadingAnimation';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.user.user);
  const vendorData = useSelector((state) => state.vendor.vendor);

  const fetchCart = async () => {
    if (userData && Object.keys(userData).length > 0) {
      try {
        const res = await fetchUserCart();
        if (res.data && res.data.products) {
          setCartItems(
            res.data.products.map(item => ({
              id: item.productId._id || item.productId,
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
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userData]);

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
        toast.error(error?.response?.data?.error || 'Failed to add product to cart.');
      }
    } else if (vendorData && Object.keys(vendorData).length > 0) {
      // Vendor logged in: block add to cart
      alert('Vendors cannot add products to the cart.');
    } else {
      // Guest: show offline modal
      setShowOfflineModal(true);
    }
  };

  const removeFromCart = async (productId) => {
    if (userData && Object.keys(userData).length > 0) {
      try {
        await removeFromCartService(productId);
        await fetchCart(); // Sync cart after removing
      } catch (error) {
        console.error("Failed to remove from cart:", error);
        alert('Failed to remove item from cart.');
      }
    } else {
      // For guests, just update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    if (userData && Object.keys(userData).length > 0) {
      try {
        await updateCartItemQuantityService(productId, quantity);
        await fetchCart(); // Sync cart after updating
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
        alert('Failed to update item quantity.');
      }
    } else {
      // For guests, just update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // This component must be defined outside of CartProvider to avoid re-rendering issues
  const OfflineCartModal = ({ onLogin, onContinue }) => {
    return (
      <div className="offline-cart-modal-overlay">
        <div className="offline-cart-modal">
          <LoadingAnimation />
          <h2 style={{ textAlign: 'center', margin: '1.5rem 0 0.5rem 0' }}>Missing Cart Items?</h2>
          <p style={{ textAlign: 'center', color: '#555', marginBottom: '1.5rem' }}>
            Please log in to your account to add products to your cart and keep your items safe.
          </p>
          <button className="offline-cart-login-btn" onClick={onLogin}>
            Login to Continue
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span
              className="offline-cart-continue-link"
              style={{ color: '#6366f1', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onContinue}
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
  
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <CartContext.Provider value={value}>
      {children}
      {showOfflineModal && (
        <OfflineCartModal
          onLogin={() => {
            setShowOfflineModal(false);
            navigate('/login');
          }}
          onContinue={() => {
            setShowOfflineModal(false);
            navigate('/');
          }}
        />
      )}
    </CartContext.Provider>
  );
}; 