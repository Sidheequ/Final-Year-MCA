import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../../services/adminServices';
import { FaDollarSign, FaShoppingCart, FaBoxOpen, FaUsers } from 'react-icons/fa';

const AdminStatCards = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values if API fails
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      id: 1,
      icon: <FaDollarSign />,
      label: 'Total Sales',
      value: `₹${stats?.totalSales || 0}`,
      className: 'admin-stat-card-primary'
    },
    {
      id: 2,
      icon: <FaShoppingCart />,
      label: 'Total Orders',
      value: (stats?.totalOrders || 0).toString(),
      className: 'admin-stat-card-warning'
    },
    {
      id: 3,
      icon: <FaBoxOpen />,
      label: 'Total Products',
      value: (stats?.totalProducts || 0).toString(),
      className: 'admin-stat-card-success'
    },
    {
      id: 4,
      icon: <FaUsers />,
      label: 'Total Customers',
      value: (stats?.totalCustomers || 0).toString(),
      className: 'admin-stat-card-info'
    }
  ];

  if (loading) {
    return (
      <div className="admin-stat-cards">
        {[1, 2, 3, 4].map((id) => (
          <div key={id} className="admin-stat-card">
            <div className="admin-stat-icon">
              <div className="skeleton-icon"></div>
            </div>
            <div className="admin-stat-content">
              <div className="skeleton-label"></div>
              <div className="skeleton-value"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-stat-cards">
      {statCards.map((card) => (
        <div key={card.id} className={`admin-stat-card ${card.className}`}>
          <div className="admin-stat-icon">
            {card.icon}
          </div>
          <div className="admin-stat-content">
            <div className="admin-stat-label">{card.label}</div>
            <div className="admin-stat-value">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatCards; 