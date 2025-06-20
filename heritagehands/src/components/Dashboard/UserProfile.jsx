import React from 'react';
import './UserDashboard.css';

const UserProfile = ({ user }) => (
  <section className="user-profile-section">
    <div className="profile-info-grid">
        <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{user?.name || 'N/A'}</span>
        </div>
        <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email || 'N/A'}</span>
        </div>
        <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{user?.phone || 'N/A'}</span>
        </div>
        <div className="info-item">
            <span className="info-label">Shipping Address</span>
            <span className="info-value">
                {user?.shippingAddress?.address ? 
                    `${user.shippingAddress.address}, ${user.shippingAddress.city}, ${user.shippingAddress.state} - ${user.shippingAddress.postalCode}` 
                    : 'No address set'}
            </span>
        </div>
    </div>
  </section>
);

export default UserProfile; 