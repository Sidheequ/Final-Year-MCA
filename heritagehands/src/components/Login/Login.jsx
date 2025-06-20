import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { userLogin } from "../../services/userServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/features/userSlice";


function Login() {

  const [value, setVAlue] = useState({
    email: "",
    password: ""

  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const OnSubmit = () => {
    userLogin(value).then((res) => {
      console.log(res)
      toast.success("Login successfully")
      dispatch(saveUser(res.data.userExist))
      navigate("/")
    }).catch((err) => {
      console.log(err)
      toast.error(err.response.data.error)
    })
  }

  return (
    <section className="login-section vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div className="login-image-container"></div>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <div className="login-form">
              <h2 className="login-title">Login</h2>
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
                <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <Link to="/signup" className="link-danger">Sign Up</Link></p>
                <p className="small fw-bold mt-2 pt-1 mb-0">Admin Login <Link to="/adminlogin" className="link-primary">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;