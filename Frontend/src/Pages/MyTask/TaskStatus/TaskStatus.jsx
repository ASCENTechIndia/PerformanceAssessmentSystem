
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Layout from "../../../Components/Layout";
import TaskSubmissionCard from "./TaskSubmissionCard";
import TakeActionForm from "./TakeActionForm";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import apiClient from "../../../../apiClient";

const TaskStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { user } = useAuth();
  const { setLoading } = useLoader();

  const task = location.state?.task;

  // Convert uploaded file to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };

      reader.onerror = (error) => reject(error);
    });
  };


  const handleActionSubmit = async (data, resetForm) => {
    try {
      setLoading(true);

      const file = data.attachments?.[0];

      let fileBase64 = "";
      let fileName = "";
      let fileType = "";

      if (file) {
        // Additional safety validation before conversion
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than or equal to 5 MB");
          return;
        }

        fileBase64 = await convertFileToBase64(file);
        fileName = file.name;
        fileType = `.${file.name.split(".").pop().toLowerCase()}`;
      }

      const payload = {
        IN_TASKASSIGNID: task.TASKASSIGNMENT_ID,
        IN_STATUSID: Number(data.status),
        IN_ACTIONBY: 12,
        IN_userid: user?.userId,
        IN_COMMENT: data.remarks,
        IN_FILENAME: fileName,
        IN_FILEDOC: fileBase64,
        IN_FILETYPE: fileType,
      };


      const response = await apiClient.post(
        "/AOPT_TASK_PROGRESS_upd",
        payload
      );


      if (response.success && response.errorCode === 0) {
        toast.success(response.errorMessage);

        resetForm();

        navigate("/Task/MyTask");
      } else {
        toast.error(response.errorMessage);
      }
    } catch (error) {
      console.error("Task Progress Error:", error);
      toast.error(error.message || "Failed to submit task progress");
    } finally {
      setLoading(false);
    }
  };


  if (!task) {
    return (
      <Layout title="Task Progress">
        <div className="bg-white rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600">
            Task information not found.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-3 text-blue-600 text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Task Progress"
      breadcrumb={{
        homeLink: "/Task/MyTask",
        homeText: "My Task",
        current: "Task Progress",
      }}
    >
      <div className="space-y-4 mx-auto">
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500">
          <span>Task Progress</span>
          <span className="text-slate-300">/</span>

          <span
            className="hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate(-1)}
          >
            My Tasks
          </span>

          <span className="text-slate-300">/</span>

          <span className="text-slate-800 font-semibold">
            {task.TASK_ID}
          </span>
        </div>

        <TaskSubmissionCard
          taskId={task.TASK_ID}
          taskTitle={task.TASK_TITLE}
        />

        <TakeActionForm
          actionBy={user?.username || "—"}
          taskStatus={task.STATUSNAME}
          onSubmitAction={handleActionSubmit}
        />
      </div>
    </Layout>
  );
};

export default TaskStatus;
