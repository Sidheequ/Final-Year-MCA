import React from "react";
import "./Signup.css";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="login-page-container">
      <form className="login-card">
        <label>Name</label>
        <input type="text" placeholder="Name" />
          <label>Email</label>
        <input type="email" placeholder="Email" />
        <label>Password</label>
        <input type="password" placeholder="Password" />
        <button className="login-btn">Sign Up</button>
        <div className="login-footer"> Already have an account?<Link to="/login" className="forgot-link"> Login</Link></div>
      </form>
      <div className="login-info">
        <h1>Sign Up now!</h1>
        <p>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
      </div>
    </div>
  );
}

export default SignUp;