import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  return (
    <Layout
      title="Dashboard"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Dashboard",
      }}
    >
      <ToastContainer position="top-right" autoClose={8000} />
    </Layout>
  );
};

export default Dashboard;
