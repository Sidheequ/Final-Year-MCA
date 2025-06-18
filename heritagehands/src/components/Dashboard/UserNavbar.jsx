import React from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import './UserDashboard.css';

const UserNavbar = () => (
  <header className="user-navbar">
    <div className="navbar-welcome">Welcome, John Doe!</div>
    <div className="navbar-actions">
      <FaBell className="navbar-icon" />
      <FaCog className="navbar-icon" />
    </div>
  </header>
);

export default UserNavbar; 