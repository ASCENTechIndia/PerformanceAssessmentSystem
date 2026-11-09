import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./HOC/Login/Login";
import ProtectedRoute from "./HOC/ProtectedRoute.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import FrmTaskTypeMst from "./Pages/Master/TaskTypeMaster/FrmTaskTypeMst.jsx";
import EmployeeMaster from "./Pages/Master/EmployeeMaster.jsx";
import DesignationMaster from "./Pages/Master/DesignationMaster/DesignationMaster.jsx";
import HierarchyMapping from "./Pages/Master/HierarchyMapping/HierarchyMapping.jsx";
import JuniorTaskManagement from "./Pages/Admin/UserAccess.jsx";
import AssignTask from "./Pages/Task/AssignTask.jsx";
import TeamTasks from "./Pages/Task/TeamTasks.jsx";
import ReviewQueue from "./Pages/Task/ReviewQueue.jsx";
import MyTasks from "./Pages/Task/MyTask/MyTasks.jsx";
import ExtensionRequests from "./Pages/Task/ExtensionRequests/ExtensionRequests.jsx";
import PerformanceDashboard from "./Pages/PerformanceDashboard/PerformanceDashboard.jsx";
import SeniorPerformanceDashboard from "./Pages/PerformanceDashboard/SeniorPerformanceDashboard.jsx";
import JuniorPerformanceDashboard from "./Pages/PerformanceDashboard/JuniorPerformanceDashboard.jsx";

function App() {
  const hostname = window.location.hostname;
  const module = hostname.split(".")[0];
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Master routes */}
                  <Route path="/Master/FrmTaskTypeMst" element={<FrmTaskTypeMst/>}/>
                  <Route path="/master/employees" element={<EmployeeMaster />} />
                  <Route path="/master/DesignationMaster" element={<DesignationMaster />} />
                  <Route path="/master/HierarchyMapping" element={<HierarchyMapping />} />

                  {/* Task Management */}
                  <Route path="/Task/MyTask" element={<MyTasks />} />
                  <Route path="/admin/userAccess" element={<JuniorTaskManagement />} />
                  <Route path="/Task/AssignTask" element={<AssignTask />} />
                  <Route path="/Task/TeamTasks" element={<TeamTasks />} />
                  <Route path="/Task/ReviewQueue" element={<ReviewQueue />} />
                  <Route path="/Task/ExtensionQueue" element={<ExtensionRequests />} />
                  <Route path="/performance/senior" element={<SeniorPerformanceDashboard />} />
                  <Route path="/performance/junior" element={<JuniorPerformanceDashboard />} />

                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
