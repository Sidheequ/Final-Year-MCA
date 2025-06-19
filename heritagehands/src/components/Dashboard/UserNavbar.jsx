import React from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import './UserDashboard.css';

const UserNavbar = () => {
  const userData = useSelector((state) => state.user.user);
  
  return (
    <header className="user-navbar">
      <div className="navbar-welcome">Welcome, {userData?.name || 'User'}!</div>
      <div className="navbar-actions">
        <FaBell className="navbar-icon" />
        <FaCog className="navbar-icon" />
      </div>
    </header>
  );
};

export default UserNavbar; 