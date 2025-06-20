import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/productServices';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  console.log("Product ID from URL:", id);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
        setTotalPrice(response.data.price);
      } catch (error) {
        setError('Error fetching product details');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleCheckout = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) return <div className="loading-full-page">Loading...</div>;
  if (error) return <div className="error-full-page">{error}</div>;
  if (!product) return <div className="error-full-page">Product not found</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-image-gallery">
          <img src={product.image} alt={product.title} className="main-product-image" />
        </div>
        <div className="product-info-details">
          <h3 className="product-title-detail">{product.title}</h3>
          <p className="product-category-detail">{product.category}</p>
          <p className="product-description-detail">{product.description}</p>
          <div className="price-container-detail">
            <span className="product-price-detail">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="quantity-selector-detail">
            <button className="btn-quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span className="quantity-display">{quantity}</span>
            <button className="btn-quantity" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <div className="product-actions-detail">
            <button className="btn-detail add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-detail checkout" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
