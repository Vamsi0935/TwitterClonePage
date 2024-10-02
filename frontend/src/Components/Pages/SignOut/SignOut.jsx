import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./signout.css";

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, sign out!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "https://twitter-clone-page-api.vercel.app/api/auth/signout",
          {},
          { withCredentials: true },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        localStorage.removeItem("token");
        localStorage.removeItem("userName");

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "You have successfully signed out.",
        });

        navigate("/");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: error.response?.data?.message || "Something went wrong.",
        });
      }
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="signout-container">
      <h2 className="signout-heading">Sign Out</h2>
      <button onClick={handleSignOut} className="signout-button">
        Sign Out
      </button>
      <button onClick={handleCancel} className="cancel-button">
        Cancel
      </button>
    </div>
  );
};

export default SignOut;
