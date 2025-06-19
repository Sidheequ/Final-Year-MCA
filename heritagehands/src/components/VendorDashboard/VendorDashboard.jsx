import React, { useState, useEffect } from 'react';
import './VendorDashboard.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { vendorLogout, getVendorProducts, deleteVendorProduct, createVendorProduct, updateVendorProduct } from '../../services/vendorServices';
import { removeVendor } from '../../redux/features/vendorSlice';
import { toast } from 'react-toastify';
import { persistor } from '../../redux/store';

function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: null
  });

  const vendorData = useSelector((state) => state.vendor.vendor);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!vendorData || Object.keys(vendorData).length === 0) {
      navigate('/vendorlogin');
      return;
    }
    fetchProducts();
  }, [vendorData, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await getVendorProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await vendorLogout();
      persistor.purge();
      dispatch(removeVendor());
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await updateVendorProduct(editingProduct._id, formData);
        toast.success('Product updated successfully');
      } else {
        await createVendorProduct(formData);
        toast.success('Product created successfully');
      }
      
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        image: null
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteVendorProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      image: null
    });
    setShowAddForm(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="vendor-dashboard">
      <header className="vendor-header">
        <div className="vendor-info">
          <h1>Welcome, {vendorData.name}!</h1>
          <p>Shop: {vendorData.shopName}</p>
        </div>
        <div className="vendor-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddForm(true)}
          >
            Add New Product
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Products</h3>
            <p>{products.filter(p => p.isActive !== false).length}</p>
          </div>
        </div>

        {showAddForm && (
          <div className="product-form-overlay">
            <div className="product-form">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Handbags">Handbags</option>
                    <option value="Mugs">Mugs</option>
                    <option value="Pots">Pots</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home Decor">Home Decor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    required={!editingProduct}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      setFormData({
                        title: '',
                        description: '',
                        category: '',
                        price: '',
                        image: null
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="products-section">
          <h2>Your Products</h2>
          {products.length === 0 ? (
            <p className="no-products">No products found. Add your first product!</p>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={product.image} alt={product.title} />
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p className="category">{product.category}</p>
                    <p className="price">₹{product.price}</p>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="btn btn-small btn-primary"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard; 