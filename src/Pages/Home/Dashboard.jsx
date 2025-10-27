import React from "react";
import Magic from "./Magic";
import "./Magic.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="relative z-10 py-20">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          Build with AI Agents
        </h1>
        <Magic />
      </div>
    </div>
  );
};

export default Dashboard;
