import React, { useState, useEffect } from 'react';
import './ProductList.css';
import Card from './Card';
//import { listProducts, testAPI, testWithFetch } from '../../services/userServices';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ProductList component mounted');
    
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

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <div className="section-container">
      <div className="content-wrapper">
        <div className="products-section">
          <h2>Our Products</h2>
          {products && products.length > 0 ? (
            <div className="products-grid">
              {products.map((product, i) => (
                <Card key={product._id || i} products={product} />
              ))}
            </div>
          ) : (
            <p className="no-products">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
