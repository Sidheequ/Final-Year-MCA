import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-page-container">
      <form className="login-card">
        <label>Email</label>
        <input type="email" placeholder="Email" />
        <label>Password</label>
        <input type="password" placeholder="Password" />
        <button className="login-btn">Login</button>
       <div className="login-footer"> Don't have an account?<Link to="/signup" className="forgot-link"> Sign Up</Link></div>
       <div className="admin-footer text-center">Admin Login <Link to="/adminlogin" className="forgot-link"> Login</Link></div>
      </form>
      <div className="login-info">
        <h1>Login now!</h1>
        <p>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
      </div>
    </div>
  );
}

export default Login;