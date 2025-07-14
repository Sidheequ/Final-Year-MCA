import React, { useState, useEffect } from 'react';
import './VendorDashboard.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getVendorSalesReport, exportSalesReport, createVendorProduct, getVendorProducts, updateVendorProduct, deleteVendorProduct } from '../../services/vendorServices';
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

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatAmount = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  const formatPercentage = (value) => `${value}%`;

  return (
    <div className="vendor-dashboard">
      <header className="vendor-header">
        <div className="vendor-info">
          <h1>Welcome, {vendorData.name}!</h1>
          <p>Shop: {vendorData.shopName}</p>
        </div>
        <div className="vendor-actions">
          <VendorNotificationBadge onSalesRefresh={fetchSalesReport} />
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            Add Product
          </button>
        </div>
      </header>

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
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddForm(false); setEditingProduct(null); setFormData({ title: '', description: '', category: '', price: '', quantity: '', image: null }); }}>Cancel</button>
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
                  <button className="btn btn-small btn-primary" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-content">
        <div className="sales-cards-row" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <SalesCard title="Total Sales" value={formatAmount(summary.totalSales || 0)} percent={summary.totalSales > 0 ? '100%' : '0%'} iconType="sales" />
          <SalesCard title="Total Earnings" value={formatAmount(summary.totalEarnings || 0)} percent={summary.totalEarnings > 0 ? '100%' : '0%'} iconType="revenue" />
        </div>

        <div className="vendor-sales-report" style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: 24, marginBottom: 32 }}>
          <div className="sales-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0 }}>Sales Report</h2>
            <div className="sales-filters" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="date"
                value={filters.startDate}
                onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                placeholder="Start Date"
                style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                placeholder="End Date"
                style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
              />
              <button onClick={fetchSalesReport} className="btn btn-small btn-primary" title="Refresh">
                <FaSyncAlt /> Refresh
              </button>
              <button onClick={handleExport} className="btn btn-small export-btn" title="Export CSV">
                <FaFileExport /> Export
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Summary Row */}
          <div className="sales-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, margin: '24px 0 12px 0', background: '#f8fafc', borderRadius: 8, padding: 16, border: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 1 }}>
            <div className="summary-card" title="Total sales value of delivered/shipped orders">
              <h3>Total Sales <FaInfoCircle style={{ fontSize: 12, color: '#888' }} /></h3>
              <p className="summary-value"><FaRupeeSign style={{ verticalAlign: 'middle' }} />{(summary.totalSales || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="summary-card" title="Total earnings after commission">
              <h3>Total Earnings <FaInfoCircle style={{ fontSize: 12, color: '#888' }} /></h3>
              <p className="summary-value earnings"><FaRupeeSign style={{ verticalAlign: 'middle' }} />{(summary.totalEarnings || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="summary-card" title="Number of delivered/shipped orders">
              <h3>Total Orders <FaInfoCircle style={{ fontSize: 12, color: '#888' }} /></h3>
              <p className="summary-value">{summary.totalOrders || 0}</p>
            </div>
            <div className="summary-card" title="Total commission paid to platform">
              <h3>Commission Paid <FaInfoCircle style={{ fontSize: 12, color: '#888' }} /></h3>
              <p className="summary-value commission"><FaRupeeSign style={{ verticalAlign: 'middle' }} />{(summary.totalCommission || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Sales Table */}
          <div className="sales-table-container" style={{ marginTop: 8 }}>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Amount</th>
                  <th>Available Stock</th>
                  <th>Sold Stock</th>
                  <th>Commission</th>
                  <th>Earnings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={12} style={{ textAlign: 'center', padding: 32 }}><span className="loading-spinner" /></td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan={12} style={{ textAlign: 'center', padding: 32 }}>No sales data found for the selected period.</td></tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale._id}>
                      <td>{formatDate(sale.orderDate)}</td>
                      <td className="order-id">{sale.orderId._id}</td>
                      <td className="product-name">
                        <div className="product-info">
                          <span>{sale.productName}</span>
                        </div>
                      </td>
                      <td>{sale.customerName}</td>
                      <td>{sale.quantity}</td>
                      <td>{formatAmount(sale.unitPrice)}</td>
                      <td className="total-amount">{formatAmount(sale.totalAmount)}</td>
                      <td>{sale.productId && typeof sale.productId.quantity === 'number' ? sale.productId.quantity : 'N/A'}</td>
                      <td>{sale.productId && typeof sale.productId.sold === 'number' ? sale.productId.sold : 'N/A'}</td>
                      <td className="commission">{formatPercentage(sale.commission)}</td>
                      <td className="earnings">{formatAmount(sale.vendorEarnings)}</td>
                      <td>
                        <span className={`status ${sale.paymentStatus}`}>
                          {sale.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard; 