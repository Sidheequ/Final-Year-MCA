import React from 'react';
import { FaUserShield, FaEnvelope, FaCalendarAlt, FaCrown } from 'react-icons/fa';

const AdminProfile = () => {
  const adminInfo = {
    name: 'Administrator',
    email: 'admin@heritagehands.com',
    role: 'Super Admin',
    joinDate: '2024-01-01',
    permissions: ['Full Access', 'User Management', 'Product Management', 'Vendor Management', 'Analytics']
  };

  return (
    <div className="admin-profile-section">
      <div className="profile-header">
        <h3>Admin Profile</h3>
        <div className="admin-badge">
          <FaCrown />
          <span>Super Admin</span>
        </div>
      </div>
      
      <div className="profile-info-grid">
        <div className="info-item">
          <div className="info-icon">
            <FaUserShield />
          </div>
          <div className="info-content">
            <div className="info-label">Name</div>
            <div className="info-value">{adminInfo.name}</div>
          </div>
        </div>
        
        <div className="info-item">
          <div className="info-icon">
            <FaEnvelope />
          </div>
          <div className="info-content">
            <div className="info-label">Email</div>
            <div className="info-value">{adminInfo.email}</div>
          </div>
        </div>
        
        <div className="info-item">
          <div className="info-icon">
            <FaCalendarAlt />
          </div>
          <div className="info-content">
            <div className="info-label">Joined</div>
            <div className="info-value">{new Date(adminInfo.joinDate).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div className="info-item">
          <div className="info-icon">
            <FaCrown />
          </div>
          <div className="info-content">
            <div className="info-label">Role</div>
            <div className="info-value">{adminInfo.role}</div>
          </div>
        </div>
      </div>
      
      <div className="permissions-section">
        <h4>Permissions</h4>
        <div className="permissions-list">
          {adminInfo.permissions.map((permission, index) => (
            <div key={index} className="permission-badge">
              {permission}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; 