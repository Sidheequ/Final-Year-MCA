import React, { useState } from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="admin-header">
      <div className="header-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>
      <div className="header-actions">
        <button className="notification-btn">🔔</button>
        <div className="user-menu">
          <img
            src="https://via.placeholder.com/40"
            alt="Admin"
            className="user-avatar"
          />
          <span className="user-name">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 