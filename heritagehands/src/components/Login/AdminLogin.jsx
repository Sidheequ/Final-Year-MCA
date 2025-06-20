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
    <section className="admin-login-section vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div className="admin-login-image-container"></div>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <div className="admin-login-form">
              <h2 className="admin-login-title">Admin Login</h2>
              <label>Email</label>
              <input type="email" placeholder="Email" name="email" className="form-control form-control-lg" onChange={(e) => {
                setVAlue({ ...value, [e.target.name]: e.target.value })
              }} />
              <label>Password</label>
              <input type="password" placeholder="Password" name="password" className="form-control form-control-lg" onChange={(e) => {
                setVAlue({ ...value, [e.target.name]: e.target.value })
              }} />
              <div className="text-center text-lg-start mt-4 pt-2">
                <button className="btn btn-primary btn-lg" onClick={OnSubmit}>Login</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;