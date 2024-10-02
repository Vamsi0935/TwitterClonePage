import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import HomePage from "./HomePage/HomePage";
import RightPanel from "./Common/RightPanel/RightPanel";

const Dashboard = () => {
  return (
    <div className="d-flex justify-content-around">
      <Sidebar />
      <HomePage />
      <RightPanel />
    </div>
  );
};

export default Dashboard;
