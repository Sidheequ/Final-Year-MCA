import React from 'react';
import { FaTachometerAlt, FaTable, FaFileInvoiceDollar, FaVrCardboard, FaExchangeAlt, FaUser, FaSignInAlt, FaUserPlus, FaStar } from 'react-icons/fa';
import './AdminDashboard.css';

const Sidebar = () => (
  <aside className="admin-sidebar">
    <div className="sidebar-header">
      <FaTachometerAlt className="sidebar-logo" />
      <span>Soft UI Dashboard</span>
    </div>
    <nav className="sidebar-nav">
      <a href="#" className="sidebar-link active"><FaTachometerAlt /> Dashboard</a>
      <a href="#" className="sidebar-link"><FaTable /> Tables</a>
      <a href="#" className="sidebar-link"><FaFileInvoiceDollar /> Billing</a>
      <a href="#" className="sidebar-link"><FaVrCardboard /> Virtual Reality</a>
      <a href="#" className="sidebar-link"><FaExchangeAlt /> RTL</a>
      <div className="sidebar-section">ACCOUNT PAGES</div>
      <a href="#" className="sidebar-link"><FaUser /> Profile</a>
      <a href="#" className="sidebar-link"><FaSignInAlt /> Sign In</a>
      <a href="#" className="sidebar-link"><FaUserPlus /> Sign Up</a>
    </nav>
    <div className="sidebar-help">
      <FaStar className="sidebar-help-icon" />
      <span>Need help?</span>
    </div>
  </aside>
);

export default Sidebar; 