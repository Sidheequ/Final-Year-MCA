import React, { useState, useEffect } from 'react';
import './VendorDashboard.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getVendorSalesReport, exportSalesReport, createVendorProduct, getVendorProducts, updateVendorProduct, deleteVendorProduct, getVendorDashboardStats } from '../../services/vendorServices';
import SalesCard from './SalesCard';
import VendorNotificationBadge from './VendorNotificationBadge';
import io from 'socket.io-client';
import { FaSyncAlt, FaFileExport, FaRupeeSign, FaInfoCircle } from 'react-icons/fa';

const SOCKET_URL = 'http://localhost:5000'; // Adjust if needed

function VendorDashboard() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    image: null
  });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);

  const vendorData = useSelector((state) => state.vendor.vendor);
  const navigate = useNavigate();

  // Real-time updates
  useEffect(() => {
    if (!vendorData || !vendorData._id) return;
    const sock = io(SOCKET_URL, { withCredentials: true });
    sock.emit('join', { room: `vendor_${vendorData._id}` });
    sock.on('vendor_notification', fetchSalesReport);
    sock.on('vendor_sales_update', fetchSalesReport);
    return () => sock.disconnect();
    // eslint-disable-next-line
  }, [vendorData]);

  useEffect(() => {
    if (!vendorData || Object.keys(vendorData).length === 0) {
      navigate('/vendorlogin');
      return;
    }
    fetchSalesReport();
    // eslint-disable-next-line
  }, [vendorData, page, filters]);

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20, ...filters };
      const response = await getVendorSalesReport(params);
      setSales(response.sales);
      setSummary(response.summary);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = { startDate: filters.startDate, endDate: filters.endDate, format: 'csv' };
      const blob = await exportSalesReport(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${filters.startDate}-${filters.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export sales report');
    }
  };

  // Add Product Handlers
  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await createVendorProduct(formData);
      setShowAddForm(false);
      setFormData({ title: '', description: '', category: '', price: '', quantity: '', image: null });
      fetchSalesReport();
      fetchProducts(); // Refresh product list
    } catch (err) {
      alert('Failed to add product');
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await getVendorProducts();
      setProducts(response.data);
    } catch (err) {
      // Optionally handle error
    }
  };
  // Fetch products on mount and after add/edit/delete
  useEffect(() => {
    if (!vendorData || Object.keys(vendorData).length === 0) return;
    fetchProducts();
    // eslint-disable-next-line
  }, [vendorData, showAddForm]);
  // Edit product handler
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      image: null
    });
    setShowAddForm(true);
  };
  // Update product handler
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateVendorProduct(editingProduct._id, formData);
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({ title: '', description: '', category: '', price: '', quantity: '', image: null });
      fetchProducts();
      fetchSalesReport();
    } catch (err) {
      alert('Failed to update product');
    }
  };
  // Delete product handler
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteVendorProduct(productId);
        fetchProducts();
        fetchSalesReport();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  // Fetch vendor dashboard stats as fallback
  const fetchDashboardStats = async () => {
    try {
      const stats = await getVendorDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      // Optionally handle error
    }
  };

  // Fetch dashboard stats on mount
  useEffect(() => {
    if (!vendorData || Object.keys(vendorData).length === 0) return;
    fetchDashboardStats();
    // eslint-disable-next-line
  }, [vendorData]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatAmount = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  const formatPercentage = (value) => `${value}%`;

  // Add a basic button style
  const buttonStyle = {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
  };
  const buttonHoverStyle = {
    background: '#1e40af',
  };

  return (
    <div className="vendor-dashboard">
      <header className="vendor-header">
        <div className="vendor-info">
          <h1>Welcome, {vendorData.name}!</h1>
          <p>Shop: {vendorData.shopName}</p>
        </div>
        <div className="vendor-actions">
          <VendorNotificationBadge onSalesRefresh={fetchSalesReport} />
          <button style={buttonStyle} onClick={() => setShowAddForm(true)}>
            Add Product
          </button>
        </div>
      </header>

      {/* Fallback: Show total sales and total orders if sales report is empty or errored */}
      {((sales.length === 0 && !loading) || error) && dashboardStats && (
        <div className="dashboard-fallback-summary" style={{ display: 'flex', gap: '2rem', margin: '2rem 0', justifyContent: 'center' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 12, minWidth: 180, textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontWeight: 500, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sales</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#059669', margin: 0 }}>{dashboardStats.vendor?.totalSales?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || 0}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 12, minWidth: 180, textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#64748b', fontWeight: 500, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>{dashboardStats.vendor?.totalOrders || 0}</p>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="product-form-overlay">
          <div className="product-form">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <div className="form-group">
                <label>Product Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required>
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
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input type="file" name="image" onChange={handleInputChange} accept="image/*" required={!editingProduct} />
              </div>
              <div className="form-actions">
                <button type="submit" style={buttonStyle}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
                <button type="button" style={{ ...buttonStyle, background: '#6b7280' }} onClick={() => { setShowAddForm(false); setEditingProduct(null); setFormData({ title: '', description: '', category: '', price: '', quantity: '', image: null }); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List Section */}
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
                  <p className="quantity" style={{ marginTop: '0', marginBottom: '0' }}>Quantity: {product.quantity}</p>
                </div>
                <div className="product-actions" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0' }}>
                  <button style={buttonStyle} onClick={() => handleEdit(product)}>Edit</button>
                  <button style={{ ...buttonStyle, background: '#ef4444' }} onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDashboard; 