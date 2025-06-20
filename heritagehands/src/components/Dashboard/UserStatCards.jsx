import React from 'react';
import { FaClipboardList, FaClock, FaCheckCircle } from 'react-icons/fa';
import './UserDashboard.css';

const UserStatCards = ({ stats }) => {
  const statData = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <FaClipboardList />, color: 'primary' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <FaClock />, color: 'warning' },
    { label: 'Delivered Orders', value: stats.deliveredOrders, icon: <FaCheckCircle />, color: 'success' },
  ];

  return (
    <div className="user-stat-cards">
      {statData.map((stat, idx) => (
        <div className={`user-stat-card user-stat-card-${stat.color}`} key={idx}>
          <div className="user-stat-icon">{stat.icon}</div>
          <div className="user-stat-info">
            <div className="user-stat-label">{stat.label}</div>
            <div className="user-stat-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStatCards; 