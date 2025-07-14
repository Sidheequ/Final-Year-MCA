import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminLogout } from '../../services/userServices';
import { removeAdmin } from '../../redux/features/adminSlice';
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
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      toast.error('Please login to access admin dashboard');
    }
  }, [admin, navigate]);

  const handleLogout = async () => {
    try {
      await adminLogout();
      dispatch(removeAdmin());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      dispatch(removeAdmin());
      navigate('/');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <AdminStatCards />
            <div className="dashboard-grid">
              <RecentOrders />
              <Analytics />
            </div>
          </div>
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
          <div className="dashboard-content">
            <AdminStatCards />
            <div className="dashboard-grid">
              <RecentOrders />
              <Analytics />
            </div>
          </div>
        );
    }
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="admin-dashboard-grid">
      {/* Left Grid - Sidebar */}
      <div className={`admin-sidebar-grid ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
        />
      </div>
      
      {/* Right Grid - Main Content */}
      <div className="admin-content-grid">
        <AdminNavbar 
          admin={admin}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="admin-content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 