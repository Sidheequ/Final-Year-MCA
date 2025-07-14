import React, { useState, useEffect } from 'react';
import { getAllCustomers } from '../../../services/adminServices';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      // TODO: Implement customer deletion logic with backend
      toast.info('Customer deletion functionality will be implemented');
    }
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div className="card-header">
          <h2>Customer Management</h2>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={id} className="customer-skeleton">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-details">
                <div className="skeleton-name"></div>
                <div className="skeleton-email"></div>
                <div className="skeleton-date"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="card-header">
        <h2>Customer Management</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="customers-list">
        {filteredCustomers.length === 0 ? (
          <p className="no-customers">No customers found</p>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer._id} className="customer-card">
              <div className="customer-avatar">
                <div className="avatar-placeholder">
                  {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="customer-details">
                <h3>{customer.name || 'Unknown Name'}</h3>
                <p className="customer-email">{customer.email}</p>
                <p className="customer-phone">{customer.phone || 'No phone number'}</p>
                <p className="customer-joined">
                  Joined: {new Date(customer.createdAt).toLocaleDateString()}
                </p>
                {customer.shippingAddress && (
                  <p className="customer-address">
                    Address: {customer.shippingAddress.address}, {customer.shippingAddress.city}
                  </p>
                )}
              </div>
              <div className="customer-actions">
                {/* <button 
                  className="admin-btn admin-btn-secondary"
                  onClick={() => toast.info('View customer details functionality will be implemented')}
                >
                  View Details
                </button> */}
                <button 
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(customer._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerManagement; 