import React from 'react';
import { FaUser, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './UserDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { persistor } from '../../redux/store';
import { userLogout } from '../../services/userServices';
import { removeUser } from '../../redux/features/userSlice';

const UserSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      userLogout().then((res) => {
        persistor.purge();
        dispatch(removeUser());
        navigate('/'); // Redirect to homepage
      });
    } catch (error) {
      console.log(error, "error from logout");
    }
  };

  return (
    <aside className="user-sidebar">
      <div className="sidebar-header">
        <FaUser className="sidebar-user-icon" /> <span>User Panel</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="..." className="sidebar-link active"><FaClipboardList /> Dashboard</Link>
        <Link to="..." className="sidebar-link"><FaClipboardList /> My Orders</Link>
        <Link to="..." className="sidebar-link"><FaCog /> Account Settings</Link>
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default UserSidebar; 