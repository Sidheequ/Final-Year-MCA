import React from 'react';
import { FaUser, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './UserDashboard.css';
import { Link } from 'react-router-dom';

const UserSidebar = () => (
  <aside className="user-sidebar">
    <div className="sidebar-header">
      <FaUser className="sidebar-user-icon" /> <span>User Panel</span>
    </div>
    <nav className="sidebar-nav">
      <Link to="..." className="sidebar-link active"><FaClipboardList /> Dashboard</Link>
      <Link to="..." className="sidebar-link"><FaClipboardList /> My Orders</Link>
      <Link to="..." className="sidebar-link"><FaCog /> Account Settings</Link>
      <Link to="..." className="sidebar-link"><FaSignOutAlt /> Logout</Link>
    </nav>
  </aside>
);

export default UserSidebar; 