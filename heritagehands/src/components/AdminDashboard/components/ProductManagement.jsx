import React, { useState, useEffect } from 'react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../../../services/adminServices';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct._id, newProduct);
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        await addProduct(newProduct);
        toast.success('Product added successfully!');
      }
      setShowAddForm(false);
      setSelectedProduct(null);
      setNewProduct({
        title: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        image: ''
      });
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(selectedProduct ? 'Failed to update product' : 'Failed to add product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully!');
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      image: product.image
    });
    setShowAddForm(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    // You can implement a modal or detailed view here
    toast.info(`Viewing details for ${product.title}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="admin-content-section">
        <div className="section-header">
          <h2>Product Management</h2>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="product-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-details">
                <div className="skeleton-title"></div>
                <div className="skeleton-category"></div>
                <div className="skeleton-price"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content-section">
      <div className="section-header">
        <h2>Product Management</h2>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setSelectedProduct(null);
            setNewProduct({
              title: '',
              description: '',
              category: '',
              price: '',
              quantity: '',
              image: ''
            });
          }}
        >
          <FaPlus /> {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <div className="admin-form-section">
          <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProduct.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={newProduct.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="admin-btn admin-btn-primary">
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-stats">
        <div className="stat-item">
          <span className="stat-label">Total Products:</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Categories:</span>
          <span className="stat-value">{categories.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Showing:</span>
          <span className="stat-value">{filteredProducts.length}</span>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-data">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="product-price">₹{product.price}</span>
                  <span className="product-quantity">Stock: {product.quantity}</span>
                </div>
                {product.vendorId && (
                  <p className="product-vendor">
                    Vendor: {product.vendorId.name || product.vendorId.shopName || 'Unknown'}
                  </p>
                )}
                <div className="product-actions">
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleView(product)}
                  >
                    <FaEye /> View
                  </button>
                  <button 
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManagement; 