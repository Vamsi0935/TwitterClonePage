import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import "./signin.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  // Handle sign-in form submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://twitter-clone-page-api.vercel.app/api/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      // Check response and handle success
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Store JWT token
        localStorage.setItem("userName", response.data.userName); // Store username
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message,
        });
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        // Handle server error response
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.data.message,
        });
      }
    } catch (error) {
      // Handle any unexpected errors
      const errorMessage =
        error.response?.data?.message || "An error occurred while signing in.";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="signin-container">
      <div className="image-container">
        <img
          src="https://img.freepik.com/premium-vector/new-twitter-logo-x-2023-twitter-x-logo-vector-download_691560-10794.jpg"
          alt="x-logo"
          width="8%"
        />
      </div>
      <h2>Sign In to X</h2>
      <form onSubmit={handleSignIn}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            value={email}
            className="form-control"
            id="email"
            placeholder="ex: example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            className="form-control"
            id="password"
            placeholder="Enter your secured password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button className="btn btn-outline-success" type="submit">
          Sign In
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
