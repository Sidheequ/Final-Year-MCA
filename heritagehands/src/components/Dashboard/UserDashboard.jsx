import React from 'react';
import './UserDashboard.css';
import UserSidebar from './UserSidebar';
import UserNavbar from './UserNavbar';
import UserStatCards from './UserStatCards';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders';

const UserDashboard = () => (
  <div className="user-dashboard-container">
    <UserSidebar />
    <div className="user-dashboard-main">
      <UserNavbar />
      <UserStatCards />
      <div className="user-dashboard-content">
        <UserProfile />
        <UserOrders />
      </div>
    </div>
  </div>
);

export default UserDashboard; 