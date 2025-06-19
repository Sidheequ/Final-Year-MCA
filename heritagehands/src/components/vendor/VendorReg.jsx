import React, { useState } from "react";
import "./VendorReg.css";
import { Link, useNavigate } from "react-router-dom";
import { vendorRegister } from "../../services/vendorServices";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { saveVendor } from "../../redux/features/vendorSlice";

function VendorReg() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
    shopName: "",
    address: ""
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
      const response = await vendorRegister(formData);
      console.log(response);
      toast.success("Vendor registration successful! Please wait for approval.");
      dispatch(saveVendor(response.data));
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="vendor-reg-page-container">
      <div className="vendor-reg-card">
        <h2>Become a Vendor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Shop Name</label>
            <input
              type="text"
              placeholder="Enter your shop name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Shop Address</label>
            <textarea
              placeholder="Enter your shop address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="vendor-reg-btn">
            Register as Vendor
          </button>
        </form>

        <div className="vendor-reg-footer">
          Already have an account?{" "}
          <Link to="/vendorlog" className="login-link">
            Login here
          </Link>
        </div>
      </div>

      <div className="vendor-reg-info">
        <h1>Join Our Vendor Community!</h1>
        <p>
          Sell your handmade products to customers worldwide. We provide a platform
          for artisans and craftsmen to showcase their unique creations and reach
          a broader audience.
        </p>
        <div className="benefits">
          <h3>Benefits of becoming a vendor:</h3>
          <ul>
            <li>Reach customers worldwide</li>
            <li>Easy product management</li>
            <li>Secure payment processing</li>
            <li>Marketing support</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VendorReg;