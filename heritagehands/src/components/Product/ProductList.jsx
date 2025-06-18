import React from 'react';
import './ProductList.css';
import Card from './Card';
import { useEffect, useState } from 'react';
//import { listProducts, testAPI, testWithFetch } from '../../services/userServices';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading products...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <div className="product-list-wrapper grid grid-cols-1 md:grid-cols-3 gap-1">
      <div className="product-list-container1">
        {products && products.length > 0 ? (
          products.map((product, i) => {
            return <Card key={i} products={product} />;
          })
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>No products found</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
