import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../services/api";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Log form submission
    console.log("Email:", formData.email, "Password:", formData.password); // Log email and password
  
    try {
      const data = await loginUser(formData.email, formData.password);
      console.log("Login response:", data);
  
      // If login is successful, set the token and redirect
      if (data.token) {
        localStorage.setItem("token", data.token); // Store the token in localStorage
        setToken(data.token); // Update the token in the parent component
        navigate("/dashboard"); // Redirect to the dashboard or another route
      } else {
        setError("Invalid credentials. Please try again."); // Handle case where token is not returned
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      setError("Invalid credentials. Please try again."); // Display error message to the user
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-title">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Show error message */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="links">
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
            <br />
            <Link to="/signup" className="signup-link">
              Don't have an account? Sign up
            </Link>{" "}
            {/* Fixed Link */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;