import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="row">
        <div className="col">
          <img
            src="https://img.freepik.com/premium-vector/new-twitter-logo-x-2023-twitter-x-logo-vector-download_691560-10794.jpg"
            alt="x-logo"
            width="65%"
          />
        </div>
        <div className="col">
          <h1 className="display-2 text-light">Happening now</h1>
          <h3 className="display-6 text-light">Join today.</h3>
          <div className="signup-buttons">
            <button>
              <FcGoogle /> SignUp with Google
            </button>
          </div>
          <div className="signup-buttons">
            <button>
              <FaApple /> SignUp with Apple
            </button>
          </div>
          <div className="horizontal-line">
            <hr />
            <p>or</p> 
            <hr />
          </div>
          <div className="signup">
            <Link to="/signup">
              <button>Create account</button>
            </Link>
          </div>
          <small>
            By signing up, you agree to the{" "}
            <span style={{ color: "blue" }}>Terms of Service</span> and Privacy{" "}
            <br /> Policy, including{" "}
            <span style={{ color: "blue" }}>Cookie Use.</span>
          </small>
          <div className="signin-button my-3">
            <h5>Already have an account?</h5>
            <Link to="/signin">
              <button className="btn btn-outline-primary w-100 mt-2">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
