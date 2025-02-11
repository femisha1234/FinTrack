import React from 'react';
import './Signup.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";

const Signup = ({ setToken }) => {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form from reloading
  
    const data = await signupUser(name, email, password);
  
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);  // Update token in App.js
      navigate("/dashboard");  // Redirect to dashboard
    } else {
      alert(data.error || "Signup failed. Please try again.");
    }
  };
  
  

  return (
    <div className="signup-container">
      <div className="signup-title">
        <h2>Sign Up</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error */}
        <form className="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
          <div className="links">
            <a href="/login" className="login-link">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};


export default Signup;
