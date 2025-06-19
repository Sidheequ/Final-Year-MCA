import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';
import { useSelector } from 'react-redux';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const userData = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!userData || Object.keys(userData).length === 0) {
      alert('Please log in as a user to add products to the cart.');
      return;
    }
    if (product) {
      addToCart(product);
      alert('Product added to cart!');
    }
  };

  const handleCheckout = () => {
    navigate('/cart');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <section className="section-container">
      <div className="content-wrapper">
        <div className="product-detail-attractive">
          <div className="product-detail-container">
            <div className="product-detail-image-section">
              <img
                alt={product.title}
                className="product-detail-image"
                src={product.image}
              />
            </div>
            <div className="product-detail-info-section">
              <h1 className="product-detail-title">{product.title}</h1>
              <h2 className="product-detail-category">{product.category}</h2>
              <div className="product-detail-rating">
                <span>⭐ {product.rating.rate} / 5</span>
                <span className="product-detail-rating-count">({product.rating.count} reviews)</span>
              </div>
              <p className="product-detail-description">{product.description}</p>
              <div className="product-detail-price-row">
                <span className="product-detail-price">${product.price}</span>
              </div>
              <div className="product-detail-action-buttons">
                <button className="product-detail-btn add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="product-detail-btn checkout-btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
