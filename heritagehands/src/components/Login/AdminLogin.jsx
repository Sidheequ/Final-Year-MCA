import React, { useState } from "react";
import "./AdminLogin.css";
import { adminLogin } from "../../services/userServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveAdmin } from "../../redux/features/adminSlice";

function AdminLogin() {
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
      const response = await adminLogin(formData);
      console.log(response);
      toast.success("Admin login successful!");
      dispatch(saveAdmin(response.data.adminExist || response.data));
      navigate("/admindashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <section className="admin-login-section vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div className="admin-login-image-container"></div>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <div className="admin-login-form">
              <h2 className="admin-login-title">Admin Login</h2>
              <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  name="email" 
                  className="form-control form-control-lg" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  name="password" 
                  className="form-control form-control-lg" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="submit" className="btn btn-primary btn-lg">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;