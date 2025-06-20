import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updatePassword } from '../../services/userServices'; 
import './AccountSettings.css';

const AccountSettings = () => {
  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    if (formData.newPassword.length < 6) {
        return toast.error("Password must be at least 6 characters long.");
    }

    setIsLoading(true);
    try {
      const response = await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success(response.data.message);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-settings-container">
      <div className="account-card">
        <h2 className="card-title">Account Information</h2>
        <div className="info-group">
          <label>Name</label>
          <p>{user?.name || 'N/A'}</p>
        </div>
        <div className="info-group">
          <label>Email</label>
          <p>{user?.email || 'N/A'}</p>
        </div>
      </div>

      <div className="account-card">
        <h2 className="card-title">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings; 