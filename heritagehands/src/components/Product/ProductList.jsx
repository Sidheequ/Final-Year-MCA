import React, { useState, useEffect } from 'react';
import './ProductList.css';
import Card from './Card';
import { listProducts } from '../../services/productServices';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="section-container">
      <div className="content-wrapper">
        <div className="products-section">
          <h2>Our Products</h2>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="category-filter" style={{ marginRight: 8 }}>Filter by Category:</label>
            <select id="category-filter" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product, i) => (
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
