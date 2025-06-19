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
  //console.log(value)
}

  return (
    <div className="login-page-container ">
     
     <div className="login-card">
      {/* <form className="login-card"> */}
        <label>Name</label>
        <input type="text" placeholder="Name" name='name' required onChange={(e)=>{
          setVAlue({...value , [e.target.name]:e.target.value})
        }}/>

          <label>Email</label>
        <input type="email" placeholder="Email" name='email' required onChange={(e) => {
          setVAlue({...value, [e.target.name]: e.target.value})
        }}/>

        <label>Phone</label>
        <input type="tel" placeholder="Phone" name='phone' required onChange={(e) => {
          setVAlue({...value, [e.target.name]: e.target.value})
        }}/>

        <label>Password</label>
        <input type="password" placeholder="Password" name='password' required onChange={(e)=>{
          setVAlue({...value , [e.target.name]:e.target.value})
        }}/>

        <label>Confirm Password</label>
        <input type="password" placeholder="Confirm Password" name='confirmpassword' required onChange={(e)=>{
          setVAlue({...value , [e.target.name]:e.target.value})
        }}/>

        <button className="login-btn" onClick={onSubmit}>Sign Up</button>
        <div className="login-footer"> Already have an account?<Link to="/login" className="forgot-link"> Login</Link></div>
      
      {/* </form> */}
      </div>
     
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