import React, { useState, useEffect } from 'react';
import './ProductList.css';
import Card from './Card';
import { listProducts } from '../../services/productServices';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await listProducts();
        setProducts(response.data.productList);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
            <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
