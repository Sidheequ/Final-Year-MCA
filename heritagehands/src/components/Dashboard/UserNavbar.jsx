import React from 'react';
import { FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './UserDashboard.css';

const UserNavbar = ({ user, onLogout }) => {
  return (
    <header className="user-navbar">
      <div className="navbar-welcome">
        <h2>Welcome, {user?.name || 'User'}!</h2>
        <p>Manage your account and track your orders</p>
      </div>
      <div className="navbar-actions">
        <button className="navbar-icon-btn">
          <FaBell className="navbar-icon" />
        </button>
        <button className="navbar-icon-btn">
          <FaCog className="navbar-icon" />
        </button>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default UserNavbar; 