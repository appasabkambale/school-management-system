import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher",
    element: (
      <ProtectedRoute role="TEACHER">
        <TeacherDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute role="STUDENT">
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
]);
