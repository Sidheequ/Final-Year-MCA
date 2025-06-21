import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBox, 
  FaStore, 
  FaChartBar, 
  FaComments,
  FaSignOutAlt,
  FaUser,
  FaCog
} from 'react-icons/fa';

// Import components
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';
import AdminStatCards from './components/AdminStatCards';
import AdminProfile from './components/AdminProfile';
import ProductManagement from './components/ProductManagement';
import VendorManagement from './components/VendorManagement';
import SalesReport from './components/SalesReport';
import Feedback from './components/Feedback';
import CustomerManagement from './components/CustomerManagement';
import RecentOrders from './components/RecentOrders';
import Analytics from './components/Analytics';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.admin);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      toast.error('Please login to access admin dashboard');
    }
  }, [admin, navigate]);

  const handleLogout = () => {
    // TODO: Implement logout functionality
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <AdminStatCards />
            <div className="dashboard-grid">
              <RecentOrders />
              <Analytics />
            </div>
          </>
        );
      case 'products':
        return <ProductManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'sales':
        return <SalesReport />;
      case 'feedback':
        return <Feedback />;
      case 'profile':
        return <AdminProfile />;
      default:
        return (
          <>
            <AdminStatCards />
            <div className="dashboard-grid">
              <RecentOrders />
              <Analytics />
            </div>
          </>
        );
    }
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="admin-main">
        <AdminNavbar 
          admin={admin}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 