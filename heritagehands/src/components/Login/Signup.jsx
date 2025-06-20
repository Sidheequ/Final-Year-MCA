import React from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { userSignUp } from "../../services/userServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignUp() {


  const [value,setVAlue] =useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmpassword:""
  })

  const navigate=useNavigate()

const onSubmit=()=>{
  userSignUp(value).then((res)=>{
    console.log(res)
    toast.success("Signup successfully")
    navigate("/")
  }).catch((err)=>{
    console.log(err)
    toast.error(err.response.data.error)
  })
}

  return (
    <section className="signup-section vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div className="signup-image-container"></div>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <div className="signup-form">
              <h2 className="signup-title">Create an Account</h2>
              
              <label>Name</label>
              <input type="text" placeholder="Name" name='name' className="form-control form-control-lg" required onChange={(e)=>{
                setVAlue({...value , [e.target.name]:e.target.value})
              }}/>

              <label>Email</label>
              <input type="email" placeholder="Email" name='email' className="form-control form-control-lg" required onChange={(e) => {
                setVAlue({...value, [e.target.name]: e.target.value})
              }}/>

              <label>Phone</label>
              <input type="tel" placeholder="Phone" name='phone' className="form-control form-control-lg" required onChange={(e) => {
                setVAlue({...value, [e.target.name]: e.target.value})
              }}/>

              <label>Password</label>
              <input type="password" placeholder="Password" name='password' className="form-control form-control-lg" required onChange={(e)=>{
                setVAlue({...value , [e.target.name]:e.target.value})
              }}/>

              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm Password" name='confirmpassword' className="form-control form-control-lg" required onChange={(e)=>{
                setVAlue({...value , [e.target.name]:e.target.value})
              }}/>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button className="btn btn-primary btn-lg" onClick={onSubmit}>Sign Up</button>
                <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <Link to="/login" className="link-danger">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;