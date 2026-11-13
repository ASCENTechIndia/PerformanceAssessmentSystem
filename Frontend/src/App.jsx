import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./HOC/Login/Login";
import ProtectedRoute from "./HOC/ProtectedRoute.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import HierarchyMapping from "./Pages/Master/HierarchyMapping/HierarchyMapping.jsx";
import UserAccess from "./Pages/Admin/UserAccess.jsx";
import AssignTask from "./Pages/Task/AssignTask.jsx";
import TeamTasks from "./Pages/Task/TeamTasks.jsx";
import ReviewQueue from "./Pages/Task/ReviewQueue.jsx";
import MyTasks from "./Pages/Task/MyTask/MyTasks.jsx";
import ExtensionRequests from "./Pages/Task/ExtensionRequests/ExtensionRequests.jsx";
import DesignationMaster from "./Pages/Master/DesignationMaster/DesignationMaster.jsx";
import DepartmentMaster from "./Pages/Master/DepartmentMaster/DepartmentMaster.jsx";
import EmployeeMaster from "./Pages/Master/EmployeeMaster/EmployeeMaster.jsx";
import SeniorPerformanceDashboard from "./Pages/PerformanceDashboard/SeniorDashboard/SeniorPerformanceDashboard.jsx";
import JuniorPerformanceDashboard from "./Pages/PerformanceDashboard/JuniorDashboard/JuniorPerformanceDashboard.jsx";
import AddEmployee from "./Pages/Master/EmployeeMaster/AddEmployee.jsx";
import TaskTypeMaster from "./Pages/Master/TaskTypeMaster/TaskTypeMaster.jsx";
import FrmAddTaskType from "./Pages/Master/TaskTypeMaster/FrmAddTaskType.jsx";
import TaskList from "./Pages/TaskManagement/TaskList.jsx";

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
                  <Route path="/master/task-type" element={<TaskTypeMaster/>}/>
                  <Route path="/Master/add-task-type" element={<FrmAddTaskType/>}/>
                  <Route path="/master/employees" element={<EmployeeMaster />} />
                  <Route path="/master/add-employee" element={<AddEmployee />} />
                  <Route path="/master/HierarchyMapping" element={<HierarchyMapping />} />
                  <Route path="/master/DepartmentMaster"  element={<DepartmentMaster />} />
                  <Route path="/master/DesignationMaster" element={<DesignationMaster />} />

                  {/* Task Management */}
                  <Route path="/task-management/tasks" element={<TaskList />} />
                  <Route path="/Task/MyTask" element={<MyTasks />} />
                  <Route path="/admin/userAccess" element={<UserAccess />} />
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
