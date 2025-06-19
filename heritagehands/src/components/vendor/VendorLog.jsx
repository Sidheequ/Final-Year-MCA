import React, { useState } from "react";
import "./VendorLog.css";
import { Link, useNavigate } from "react-router-dom";
import { vendorLogin } from "../../services/vendorServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { saveVendor } from "../../redux/features/vendorSlice";

function VendorLog() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await vendorLogin(formData);
      console.log(response);
      toast.success("Vendor login successful!");
      dispatch(saveVendor(response.data.vendorExist));
      navigate('/vendordashboard');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="vendor-log-page-container">
      <div className="vendor-log-card">
        <h2>Vendor Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="vendor-log-btn">
            Login as Vendor
          </button>
        </form>

        <div className="vendor-log-footer">
          Don't have an account?{" "}
          <Link to="/vendorreg" className="register-link">
            Register here
          </Link>
        </div>
      </div>

      <div className="vendor-log-info">
        <h1>Welcome Back, Vendor!</h1>
        <p>
          Access your vendor dashboard to manage your products, track sales, and
          grow your business with our platform.
        </p>
        <div className="features">
          <h3>Manage your business:</h3>
          <ul>
            <li>Add new products</li>
            <li>Update product details</li>
            <li>Track your sales</li>
            <li>View customer orders</li>
            <li>Manage inventory</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VendorLog;