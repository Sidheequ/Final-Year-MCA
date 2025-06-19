import React, { useState, useEffect } from 'react';
import { getAllVendors, approveVendor, rejectVendor, deleteVendor, testGetVendors } from '../../../services/adminServices';
import { toast } from 'react-toastify';
import './VendorManagement.css';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  const fetchVendors = async () => {
    try {
      console.log('Fetching vendors...');
      const response = await getAllVendors();
      console.log('Vendors response:', response);
      console.log('Vendors data:', response.data);
      setVendors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      toast.error('Failed to fetch vendors');
      setLoading(false);
    }
  };

  const testFetchVendors = async () => {
    try {
      console.log('Testing vendor fetch without auth...');
      const response = await testGetVendors();
      console.log('Test vendors response:', response);
      console.log('Test vendors data:', response.data);
      toast.success(`Found ${response.data.count} vendors in database`);
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed: ' + error.message);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

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

  const filteredVendors = vendors.filter(vendor => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !vendor.isApproved && !vendor.isRejected;
    if (filter === 'approved') return vendor.isApproved;
    if (filter === 'rejected') return vendor.isRejected;
    return true;
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
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(vendor._id)}
          >
            Delete
          </button>
        </div>
      );
    } else if (vendor.isRejected) {
      return (
        <div className="action-buttons">
          <button 
            className="btn btn-success btn-sm"
            onClick={() => handleApprove(vendor._id)}
          >
            Approve
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(vendor._id)}
          >
            Delete
          </button>
        </div>
      );
    } else {
      return (
        <div className="action-buttons">
          <button 
            className="btn btn-success btn-sm"
            onClick={() => handleApprove(vendor._id)}
          >
            Approve
          </button>
          <button 
            className="btn btn-warning btn-sm"
            onClick={() => handleReject(vendor._id)}
          >
            Reject
          </button>
        </div>
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading vendors...</div>;
  }

  return (
    <div className="vendor-management">
      <div className="vendor-header">
        <h2>Vendor Management</h2>
        <div className="vendor-actions">
          <button onClick={testFetchVendors} className="test-btn">
            Test DB Connection
          </button>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Vendors</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="vendor-stats">
        <div className="stat-card">
          <h3>Total Vendors</h3>
          <p>{vendors.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approval</h3>
          <p>{vendors.filter(v => !v.isApproved && !v.isRejected).length}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p>{vendors.filter(v => v.isApproved).length}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p>{vendors.filter(v => v.isRejected).length}</p>
        </div>
      </div>

      <div className="vendor-list">
        {filteredVendors.length === 0 ? (
          <div className="no-vendors">
            <p>No vendors found matching the selected filter.</p>
          </div>
        ) : (
          <div className="vendor-grid">
            {filteredVendors.map((vendor) => (
              <div key={vendor._id} className="vendor-card">
                <div className="vendor-info">
                  <div className="vendor-header-info">
                    <h4>{vendor.name}</h4>
                    {getStatusBadge(vendor)}
                  </div>
                  <div className="vendor-details">
                    <p><strong>Email:</strong> {vendor.email}</p>
                    <p><strong>Phone:</strong> {vendor.phone}</p>
                    <p><strong>Shop Name:</strong> {vendor.shopName}</p>
                    <p><strong>Address:</strong> {vendor.address}</p>
                    <p><strong>Registered:</strong> {new Date(vendor.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="vendor-actions">
                  {getActionButtons(vendor)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManagement; 