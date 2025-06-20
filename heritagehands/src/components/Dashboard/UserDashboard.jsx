import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import UserSidebar from './UserSidebar';
import UserNavbar from './UserNavbar';
import UserStatCards from './UserStatCards';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders';
import AccountSettings from './AccountSettings';
import AddressSettings from './AddressSettings';
import { getUserProfile, getOrderStats, userLogout } from '../../services/userServices';
import { saveUser, removeUser } from '../../redux/features/userSlice';
import { toast } from 'react-toastify';
import { persistor } from '../../redux/store';
// We will create this component next
// import AccountSettings from './AccountSettings'; 

const UserDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, statsRes] = await Promise.all([
          getUserProfile(),
          getOrderStats()
        ]);
        dispatch(saveUser(profileRes.data));
        setOrderStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, navigate, user]);

  const handleLogout = async () => {
    try {
      await userLogout();
      persistor.purge();
      dispatch(removeUser());
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="dashboard-overview-layout">
            <div className="dashboard-left-column">
              <UserStatCards stats={orderStats} />
            </div>
            <div className="dashboard-right-column">
              <UserProfile user={user} />
            </div>
          </div>
        );
      case 'profile':
        return <UserProfile user={user} />;
      case 'orders':
        return <UserOrders />;
      case 'settings':
        return <AccountSettings />;
      case 'address':
        return <AddressSettings />;
      default:
        return <UserProfile user={user} />;
    }
  };

  const viewTitles = {
    dashboard: {
      title: 'Dashboard',
    },
    profile: {
      title: 'User Profile',
    },
    orders: {
      title: 'My Orders',
    },
    settings: {
      title: 'Account Settings',
    },
    address: {
      title: 'Address Settings',
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="user-dashboard-container">
      <UserSidebar 
        user={user} 
        activeView={activeView} 
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <main className="user-dashboard-main">
        <UserNavbar 
          user={user}
          onLogout={handleLogout}
        />
        <div className="user-dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 