import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  const performaceAssessSystemSession =
    sessionStorage.getItem("performaceAssessSystemSession") ||
    localStorage.getItem("performaceAssessSystemSession");

  if (!user && !performaceAssessSystemSession) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
