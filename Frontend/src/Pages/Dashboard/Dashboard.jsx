import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import RoleBasedDashboard from "./RolesDashboard/RoleBasedDashboard";


const Dashboard = () => {
  const userRole = "";
  return (
    <Layout
      title="Dashboard"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Dashboard",
      }}
    >
      {userRole && <RoleBasedDashboard role={userRole} />}
    </Layout>
  );
};



export default Dashboard;
