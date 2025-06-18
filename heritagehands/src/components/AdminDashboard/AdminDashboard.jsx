import React, { useState } from 'react';
import './AdminDashboard.css';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardStats from './components/DashboardStats';
import RecentOrders from './components/RecentOrders';
import ProductManagement from './components/ProductManagement';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <DashboardStats />
            <RecentOrders />
          </>
        );
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <RecentOrders />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 