import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

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
    if (product) {
      addToCart(product);
      // Optional: Add a visual feedback that item was added
      alert('Product added to cart!');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <section className="product-section">
      <div className="container">
        <div className="product-wrapper">
          <img
            alt={product.title}
            className="product-image"
            src={product.image}
          />
          <div className="product-details">
            <h2 className="brand-name">{product.category}</h2>
            <h1 className="product-title">{product.title}</h1>
            <p className="product-description">
              {product.description}
            </p>

            <div className="product-options">
              <div className="size-options">
                <span className="option-label">Size</span>
                <div className="size-select-wrapper">
                  <select className="size-select">
                    <option>SM</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
              </div>

              <div className="rating">
                <span className="option-label">Rating</span>
                <div className="rating-value">
                  {product.rating.rate} ({product.rating.count} reviews)
                </div>
              </div>
            </div>

            <div className="product-footer">
              <span className="product-price">${product.price}</span>
              <button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button className="wishlist-button">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="wishlist-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
