import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./signup.css";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) formErrors.fullName = "Full name is required";
    if (!userName) formErrors.userName = "User name is required"; // Added validation
    if (!email) formErrors.email = "Email is required";
    else if (!emailRegex.test(email)) formErrors.email = "Invalid email format";
    if (!phoneNumber) formErrors.phoneNumber = "Phone number is required";
    if (!birthDate) formErrors.birthDate = "Date of Birth is required";
    if (!password || password.length < 6)
      formErrors.password = "Password must be at least 6 characters long";

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axios.post(
          "https://twitter-clone-page-api.vercel.app/api/auth/signup",
          {
            fullName,
            userName,
            email,
            phoneNumber,
            birthDate,
            password,
          },
          { withCredentials: true }
        );

        // Log the response for debugging
        console.log(response.data);

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userName", userName);

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
          });
          navigate("/signin");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: response.data.message,
          });
        }
      } catch (error) {
        console.error(error); // Log any errors for debugging
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while signing up.";
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: errorMessage,
        });
      }
    }
  };

  const getInputClass = (field) => {
    return errors[field] ? "form-control is-invalid" : "form-control";
  };

  return (
    <div className="signup-container">
      <div className="image-container">
        <img
          src="https://img.freepik.com/premium-vector/new-twitter-logo-x-2023-twitter-x-logo-vector-download_691560-10794.jpg"
          alt="x-logo"
          width="8%"
        />
      </div>
      <h2>Create your account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className={getInputClass("fullName")}
            id="fullName"
            placeholder="Enter your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className="invalid-feedback">{errors.fullName}</div>
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="userName" className="form-label">
            User Name
          </label>
          <input
            type="text"
            className={getInputClass("userName")}
            id="userName"
            placeholder="Enter your user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <div className="invalid-feedback">{errors.userName}</div>
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={getInputClass("email")}
            id="email"
            placeholder="ex: example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            className={getInputClass("phoneNumber")}
            id="phoneNumber"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="invalid-feedback">{errors.phoneNumber}</div>
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="birthDate" className="form-label">
            Date of Birth
          </label>
          <input
            type="date"
            className={getInputClass("birthDate")}
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <div className="invalid-feedback">{errors.birthDate}</div>
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={getInputClass("password")}
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="invalid-feedback">{errors.password}</div>
        </div>
        <button className="btn btn-outline-success" type="submit">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
