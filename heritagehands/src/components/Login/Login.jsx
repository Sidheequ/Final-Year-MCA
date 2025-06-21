import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../services/userServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/features/userSlice";

function Login() {
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
      const response = await userLogin(formData);
      console.log(response);
      toast.success("User login successful!");
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      dispatch(saveUser(response.data.userExist));
      navigate('/userdashboard');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <section className="section-container">
      <div className="content-wrapper">
        <div className="user-log-page-container">
          <div className="user-log-card">
            <h2>User Login</h2>
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

              <button type="submit" className="user-log-btn btn btn-primary">
                Login
              </button>
            </form>

            <div className="user-log-footer">
              Don't have an account?{" "}
              <Link to="/signup" className="register-link">
                Register here
              </Link>
              <p>Admin Login</p>
              <Link to="/adminlogin" className="register-link "> Admin Login
              </Link>
            </div>
          </div>

          <div className="user-log-info">
            <h1>Welcome Back, User!</h1>
            <p>
              Access your user dashboard to manage your profile, track orders, and
              explore our amazing products.
            </p>
            <div className="features">
              <h3>Manage your account:</h3>
              <ul>
                <li>View your profile</li>
                <li>Track your orders</li>
                <li>Update account settings</li>
                <li>Manage shipping addresses</li>
                <li>View order history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;