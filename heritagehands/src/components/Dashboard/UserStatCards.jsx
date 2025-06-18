import React from 'react';
import { FaClipboardList, FaClock, FaCheckCircle } from 'react-icons/fa';
import './UserDashboard.css';

const stats = [
  { label: 'Total Orders', value: 12, icon: <FaClipboardList />, color: 'primary' },
  { label: 'Pending Orders', value: 2, icon: <FaClock />, color: 'warning' },
  { label: 'Delivered Orders', value: 10, icon: <FaCheckCircle />, color: 'success' },
];

const UserStatCards = () => (
  <div className="user-stat-cards">
    {stats.map((stat, idx) => (
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

export default UserStatCards; 