import React from "react";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaSearch } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const userName = localStorage.getItem("userName"); 

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <Link to="/" className="logo">
          <img
            src="https://img.freepik.com/premium-vector/new-twitter-logo-x-2023-twitter-x-logo-vector-download_691560-10794.jpg"
            alt="Logo"
          />
        </Link>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <MdHomeFilled className="icon" />
              <span className="profile-name">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/explore" className="nav-link">
              <FaSearch className="icon" />
              <span className="profile-name">Explore</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/notifications" className="nav-link">
              <IoNotifications className="icon" />
              <span className="profile-name">Notifications</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to={`/profile/${userName}`} className="nav-link">
              <FaUser className="icon" />
              <span className="profile-name">Profile</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signout" className="nav-link">
              <LuLogOut className="icon" />
              <span className="profile-name">Log Out</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
