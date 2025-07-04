import React from 'react';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaStore, 
  FaUsers, 
  FaChartBar, 
  FaComments,
  FaUser,
  FaCog,
  FaBars,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminSidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed, onLogout }) => {
  const navItems = [
    { key: 'dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { key: 'products', icon: <FaBox />, label: 'Product Management' },
    { key: 'vendors', icon: <FaStore />, label: 'Vendor Management' },
    { key: 'customers', icon: <FaUsers />, label: 'Customer Management' },
    { key: 'sales', icon: <FaChartBar />, label: 'Sales Report' },
    { key: 'feedback', icon: <FaComments />, label: 'Customer Feedback' },
    { key: 'profile', icon: <FaUser />, label: 'Profile' },
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </div>
        {!collapsed && (
          <div className="sidebar-brand">
            <h3>Admin Panel</h3>
            <p>Heritage Hands</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`sidebar-link ${activeSection === item.key ? 'active' : ''}`}
            onClick={() => setActiveSection(item.key)}
            title={collapsed ? item.label : ''}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-link logout-btn"
          onClick={onLogout}
          title={collapsed ? 'Logout' : ''}
        >
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </button>
        
        {!collapsed && (
          <div className="sidebar-info">
            <small>Admin Dashboard v1.0</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar; 