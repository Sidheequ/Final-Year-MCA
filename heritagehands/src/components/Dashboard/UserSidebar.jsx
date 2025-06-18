import React from 'react';
import { FaUser, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './UserDashboard.css';

const UserSidebar = () => (
  <aside className="user-sidebar">
    <div className="sidebar-header">
      <FaUser className="sidebar-user-icon" /> <span>User Panel</span>
    </div>
    <nav className="sidebar-nav">
      <a href="#" className="sidebar-link active"><FaClipboardList /> Dashboard</a>
      <a href="#" className="sidebar-link"><FaClipboardList /> My Orders</a>
      <a href="#" className="sidebar-link"><FaCog /> Account Settings</a>
      <a href="#" className="sidebar-link"><FaSignOutAlt /> Logout</a>
    </nav>
  </aside>
);

export default UserSidebar; 