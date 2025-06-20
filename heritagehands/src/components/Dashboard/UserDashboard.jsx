import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './UserDashboard.css';
import UserSidebar from './UserSidebar';
import UserNavbar from './UserNavbar';
import UserStatCards from './UserStatCards';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders';
import AccountSettings from './AccountSettings';
// We will create this component next
// import AccountSettings from './AccountSettings'; 

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('account');
  const { user } = useSelector((state) => state.user);

  const renderContent = () => {
    switch (activeView) {
      case 'account':
        return <AccountSettings />;
      case 'orders':
        return <UserOrders />;
      default:
        return <AccountSettings />;
    }
  };

  const viewTitles = {
    account: {
      title: 'Account Settings',
    },
    orders: {
      title: 'My Orders',
    }
  }

  return (
    <div className="user-dashboard-container">
      <UserSidebar 
        user={user} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <main className="user-dashboard-main">
        <UserNavbar />
        <div className="user-dashboard-content">
          <h4 className="content-header mt-2">{viewTitles[activeView].title}</h4>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 