import React from "react";
import "./VendorReg.css";
import { Link } from "react-router-dom";

function VendorReg() {
  return (
    <div className="login-page-container">
      <form className="login-card">
         <label>Name</label>
        <input type="text" placeholder="Name" />
        <label>Email</label>
        <input type="email" placeholder="Email" />
        <label>Password</label>
        <input type="password" placeholder="Password" />
        <button className="login-btn">Login</button>
        <div className="vendor-footer"> Already have an account?<Link to="/vendorlog" className="forgot-link"> Login</Link></div>

      </form>
      <div className="login-info">
        <h1> Vendor Registration now!</h1>
        <p>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
      </div>
    </div>
  );
}

export default VendorReg;