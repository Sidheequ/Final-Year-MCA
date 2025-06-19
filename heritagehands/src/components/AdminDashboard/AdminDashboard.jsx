import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardStats from './components/DashboardStats';
import RecentOrders from './components/RecentOrders';
import ProductManagement from './components/ProductManagement';
import VendorManagement from './components/VendorManagement';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = document.cookie.includes('Admin_token');
    if (!adminToken) {
      console.log('No admin token found, redirecting to admin login');
      navigate('/adminlogin');
    }
  }, [navigate]);

  const renderContent = () => {
    console.log('Rendering content for section:', activeSection);
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
      case 'vendors':
        console.log('Rendering VendorManagement component');
        return <VendorManagement />;
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