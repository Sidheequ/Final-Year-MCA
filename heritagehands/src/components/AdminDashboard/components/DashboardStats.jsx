import React from 'react';

const DashboardStats = () => {
  // This will be replaced with actual data from the database
  const stats = [
    {
      id: 1,
      title: 'Total Sales',
      value: '$12,345',
      change: '+12%',
      trend: 'up',
    },
    {
      id: 2,
      title: 'Total Orders',
      value: '1,234',
      change: '+8%',
      trend: 'up',
    },
    {
      id: 3,
      title: 'Total Products',
      value: '567',
      change: '+5%',
      trend: 'up',
    },
    {
      id: 4,
      title: 'Total Customers',
      value: '890',
      change: '+15%',
      trend: 'up',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-card">
          <h3>{stat.title}</h3>
          <div className="value">{stat.value}</div>
          <div className={`trend ${stat.trend}`}>
            {stat.change} from last month
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats; 