import React from "react";
import "./AdminLogin.css";
import { useState } from "react";
import { adminLogin } from "../../services/userServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function AdminLogin() {

  const [value, setVAlue] = useState({
    email: "",
    password: ""

  })
  const navigate = useNavigate()

  const OnSubmit = () => {
    adminLogin(value).then((res) => {
      console.log(res)
      toast.success("Login successfully")
      navigate("/admindashboard")
    }).catch((err) => {
      console.log(err)
      toast.error(err.response.data.error)
    })
  }




  return (
    <div className="login-page-container">
      <div className="login-card">

        <label>Email</label>
        <input type="email" placeholder="Email" name="email" onChange={(e) => {
          setVAlue({ ...value, [e.target.name]: e.target.value })
        }} />
        <label>Password</label>
        <input type="password" placeholder="Password" name="password" onChange={(e) => {
          setVAlue({ ...value, [e.target.name]: e.target.value })
        }} />
        <button className="login-btn" onClick={OnSubmit}>Login</button>

      </div>
      <div className="login-info">
        <h1>Login now!</h1>
        <p>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;