import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home/Home";
import SignIn from "./Components/Pages/SignIn/SignIn";
import SignUp from "./Components/Pages/SignUp/SignUp";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProfilePage from "./Components/Pages/Profile/Profile";
import SignOut from "./Components/Pages/SignOut/SignOut";
import Search from "./Components/Dashboard/Common/Search/Search";
import NotificationPage from "./Components/Dashboard/Notification/NotificationPage";
import "./App.css";

const App = () => {
  // const authUser = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/explore" element={<Search />} />
        <Route path="/profile/:userName" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
