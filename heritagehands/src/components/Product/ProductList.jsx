import React, { useState, useEffect } from 'react';
import './ProductList.css';
//import Card from './Card';
//import { listProducts, testAPI, testWithFetch } from '../../services/userServices';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    console.log('ProductList component mounted');
    
    // Simple test - try fetch first
    fetch('http://localhost:5000/api/v1/product/listproducts')
      .then(response => {
        console.log('Fetch response:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetch data received:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const toggleDescription = (productId) => {
    setExpandedCards(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <div className="product-page-container">
      <div className="products-section">
        <h2>Our Products</h2>
        {products && products.length > 0 ? (
          <div className="products-grid">
            {products.map((product, i) => {
              const isExpanded = expandedCards[product._id || i];
              const description = product.description || '';
              const shouldShowReadMore = description.length > 120;
              
              return (
                <div key={product._id || i} className="product-card">
                  <img src={product.image} alt={product.title} />
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p>
                      {isExpanded ? description : truncateText(description)}
                      {shouldShowReadMore && (
                        <button 
                          className="read-more-btn"
                          onClick={() => toggleDescription(product._id || i)}
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </p>
                    <p className="category">{product.category}</p>
                    <p className="price">₹{product.price}</p>
                  </div>
                  <div className="product-actions">
                    <button className="btn btn-small btn-primary">Add to Cart</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
