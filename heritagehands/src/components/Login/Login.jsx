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
    <section className="section-container">
      <div className="content-wrapper">
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
            <div className="login-footer"> Don't have an account?<Link to="/signup" className="forgot-link"> Sign Up</Link></div>
            <div className="admin-footer text-center">Admin Login <Link to="/adminlogin" className="forgot-link"> Login</Link></div>
          </div>
          <div className="login-info">
            <h1>Login now!</h1>
            <p>
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;