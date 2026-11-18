import React from "react";

import CommissionerDashboard from "./ComissionerDashboard";
import HODDashboard from "./HODDashboard";
import SeniorOfficerDashboard from "./SeniorOfficerDashboard";
import JuniorEmployeeDashboard from "./JuniorEmployeeDashboard";
import AdministratorDashboard from "./AdministratorDashboard";

const RoleBasedDashboard = ({ role, dashboardData }) => {
  const dashboards = {
    COMMISSIONER: CommissionerDashboard,
    HOD: HODDashboard,
    SENIOR_OFFICER: SeniorOfficerDashboard,
    JUNIOR_EMPLOYEE: JuniorEmployeeDashboard,
    ADMINISTRATOR: AdministratorDashboard,
  };

  const DashboardComponent = dashboards[role];

  if (!DashboardComponent) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        No dashboard available for this role.
      </div>
    );
  }

  return <DashboardComponent data={dashboardData} />;
};

export default RoleBasedDashboard;