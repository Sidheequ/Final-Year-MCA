import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminNavbar = ({ onLogout }) => {
  return (
    <header className="admin-navbar">
      <div className="navbar-welcome">
        <h2>Welcome, Admin!</h2>
        <p>Manage your e-commerce platform and monitor business performance</p>
      </div>
      <div className="navbar-actions">
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar; 