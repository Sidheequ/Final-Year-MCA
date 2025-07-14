import React, { useState, useEffect } from 'react';
import { getAllVendors, approveVendor, rejectVendor, deleteVendor, getVendorDetails, getVendorProductsForAdmin } from '../../../services/adminServices';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaTrash, FaSearch, FaEye, FaStore } from 'react-icons/fa';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorDetailsModal, setVendorDetailsModal] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await getAllVendors();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    try {
      await approveVendor(vendorId);
      toast.success('Vendor approved successfully');
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast.error('Failed to approve vendor');
    }
  };

  const handleReject = async (vendorId) => {
    try {
      await rejectVendor(vendorId);
      toast.success('Vendor rejected successfully');
      fetchVendors(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast.error('Failed to reject vendor');
    }
  };

  const handleDelete = async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      try {
        await deleteVendor(vendorId);
        toast.success('Vendor deleted successfully');
        fetchVendors(); // Refresh the list
      } catch (error) {
        console.error('Error deleting vendor:', error);
        toast.error('Failed to delete vendor');
      }
    }
  };

  const handleView = async (vendor) => {
    try {
      setLoading(true);
      const [detailsRes, productsRes] = await Promise.all([
        getVendorDetails(vendor._id),
        getVendorProductsForAdmin(vendor._id)
      ]);
      setVendorDetails(detailsRes.data);
      setVendorProducts(productsRes.data);
      setVendorDetailsModal(true);
    } catch (error) {
      toast.error('Failed to fetch vendor details or products');
    } finally {
      setLoading(false);
    }
  };

  const closeVendorDetailsModal = () => {
    setVendorDetailsModal(false);
    setVendorDetails(null);
    setVendorProducts([]);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'pending') {
      matchesStatus = !vendor.isApproved && !vendor.isRejected;
    } else if (filterStatus === 'approved') {
      matchesStatus = vendor.isApproved;
    } else if (filterStatus === 'rejected') {
      matchesStatus = vendor.isRejected;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (vendor) => {
    if (vendor.isApproved) {
      return <span className="status-badge approved">Approved</span>;
    } else if (vendor.isRejected) {
      return <span className="status-badge rejected">Rejected</span>;
    } else {
      return <span className="status-badge pending">Pending</span>;
    }
  };

  const getActionButtons = (vendor) => {
    if (vendor.isApproved) {
      return (
        <div className="action-buttons">
          {/* <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => handleView(vendor)}
          >
            <FaEye /> View
          </button> */}
          <button 
            className="admin-btn admin-btn-danger"
            onClick={() => handleDelete(vendor._id)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      );
    } else if (vendor.isRejected) {
      return (
        <div className="action-buttons">
          <button 
            className="admin-btn admin-btn-success"
            onClick={() => handleApprove(vendor._id)}
          >
            <FaCheck /> Approve
          </button>
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => handleView(vendor)}
          >
            <FaEye /> View
          </button>
          <button 
            className="admin-btn admin-btn-danger"
            onClick={() => handleDelete(vendor._id)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      );
    } else {
      return (
        <div className="action-buttons">
          <button 
            className="admin-btn admin-btn-success"
            onClick={() => handleApprove(vendor._id)}
          >
            <FaCheck /> Approve
          </button>
          <button 
            className="admin-btn admin-btn-warning"
            onClick={() => handleReject(vendor._id)}
          >
            <FaTimes /> Reject
          </button>
          <button 
            className="admin-btn admin-btn-secondary"
            onClick={() => handleView(vendor)}
          >
            <FaEye /> View
          </button>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-content-section">
        <div className="section-header">
          <h2>Vendor Management</h2>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="vendor-skeleton">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-details">
                <div className="skeleton-name"></div>
                <div className="skeleton-email"></div>
                <div className="skeleton-shop"></div>
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
        <h2>Vendor Management</h2>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Vendors</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="vendor-stats">
        <div className="stat-item">
          <span className="stat-label">Total Vendors:</span>
          <span className="stat-value">{vendors.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending:</span>
          <span className="stat-value">{vendors.filter(v => !v.isApproved && !v.isRejected).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Approved:</span>
          <span className="stat-value">{vendors.filter(v => v.isApproved).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rejected:</span>
          <span className="stat-value">{vendors.filter(v => v.isRejected).length}</span>
        </div>
      </div>

      <div className="vendors-grid">
        {filteredVendors.length === 0 ? (
          <div className="no-data">
            <p>No vendors found matching your criteria.</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div key={vendor._id} className="vendor-card">
              <div className="vendor-header">
                <div className="vendor-avatar">
                  <FaStore />
                </div>
                <div className="vendor-status">
                  {getStatusBadge(vendor)}
                </div>
              </div>
              <div className="vendor-details">
                <h3>{vendor.name}</h3>
                <p className="vendor-email">{vendor.email}</p>
                <p className="vendor-shop">{vendor.shopName}</p>
                <p className="vendor-phone">{vendor.phone || 'No phone number'}</p>
                <p className="vendor-joined">
                  Joined: {new Date(vendor.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="vendor-actions">
                {getActionButtons(vendor)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vendor Details Modal */}
      {vendorDetailsModal && vendorDetails && (
        <div className="modal-overlay" onClick={closeVendorDetailsModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Vendor Details</h3>
            <ul className="vendor-details-list">
              <li><strong>Name:</strong> {vendorDetails.name}</li>
              <li><strong>Email:</strong> {vendorDetails.email}</li>
              <li><strong>Shop Name:</strong> {vendorDetails.shopName}</li>
              <li><strong>Phone:</strong> {vendorDetails.phone || 'N/A'}</li>
              <li><strong>Address:</strong> {vendorDetails.address || 'N/A'}</li>
              <li><strong>Status:</strong> {getStatusBadge(vendorDetails)}</li>
              <li><strong>Joined:</strong> {new Date(vendorDetails.createdAt).toLocaleString()}</li>
            </ul>
            <h4>Products</h4>
            {vendorProducts.length === 0 ? (
              <p>No products found for this vendor.</p>
            ) : (
              <table className="vendor-products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorProducts.map(product => (
                    <tr key={product._id}>
                      <td>
                        {product.image ? (
                          <img src={product.image} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td>{product.title}</td>
                      <td>{product.description}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button className="admin-btn admin-btn-secondary" onClick={closeVendorDetailsModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement; 