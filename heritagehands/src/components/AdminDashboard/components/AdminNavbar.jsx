import React from 'react';
import { FaBars } from 'react-icons/fa';

const AdminNavbar = ({ onToggleSidebar }) => {
  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        {/* <button className="navbar-toggle" >
          <FaBars />
        </button> */}
        <div className="navbar-welcome">
          <h2>Welcome, Admin!</h2>
          <p>Manage your e-commerce platform and monitor business performance</p>
        </div>
      </div>
      <div className="navbar-actions">
        <div className="navbar-time">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar; 