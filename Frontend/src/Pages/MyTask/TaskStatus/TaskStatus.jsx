import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import TaskSubmissionCard from "./TaskSubmissionCard";
import TakeActionForm from "./TakeActionForm";

/* Dummy data — replace with API fetch using useParams */
const MOCK_TASK_DETAILS = {
  id: "ASG-20231",
  title: "Inspect drainage line, Ward 14 (Virar East)",
};

const TaskStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Use this when wiring to API

  const handleActionSubmit = async (data) => {
    try {
      // await apiService.post(`/tasks/${MOCK_TASK_DETAILS.id}/action`, data);
      console.log("Action submitted →", data);
      toast.success(`Task ${MOCK_TASK_DETAILS.id} updated to ${data.status}`);
      navigate("/task-management/pending-approvals"); // Redirect back
    } catch (err) {
      toast.error("Failed to submit action");
    }
  };

  return (
    <Layout
      title="Task Status"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Task Status",
        current: "Pending Approvals",
        // If you need a 3rd level, you might need to adjust the Layout component
        // to accept breadcrumb.parent
      }}
    >
      <div className="space-y-4 mx-auto">
        {/* Top Context Bar (Custom Breadcrumb matching screenshot) */}
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
          <span>Task Status</span>
          <span className="text-slate-300">/</span>
          <span
            className="hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate(-1)}
          >
            Pending Approvals
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">
            {MOCK_TASK_DETAILS.id}
          </span>
        </div>

        <TaskSubmissionCard
          taskId={MOCK_TASK_DETAILS.id}
          taskTitle={MOCK_TASK_DETAILS.title}
        />

        <TakeActionForm
          actionBy="Rajesh Kulkarni (you)"
          onSubmitAction={handleActionSubmit}
        />
      </div>
    </Layout>
  );
};

export default TaskStatus;
