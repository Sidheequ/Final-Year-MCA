import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import './UserDashboard.css';

const UserNavbar = ({ user, onLogout }) => {
  return (
    <header className="user-navbar">
      <div className="navbar-welcome">
        <h2>Welcome, {user?.name || 'User'}!</h2>
        <p>Manage your account and track your orders</p>
      </div>
      <div className="navbar-actions ">
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span className=''>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default UserNavbar; 