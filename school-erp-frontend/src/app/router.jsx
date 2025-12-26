import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminRoutes from "./routes/AdminRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import { Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  { path: "/login", element: <Login /> },

  {
    path: "/admin/*",
    element: (
      <ProtectedRoute role="ADMIN">
        <AdminRoutes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/*",
    element: (
      <ProtectedRoute role="TEACHER">
        <TeacherRoutes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/*",
    element: (
      <ProtectedRoute role="STUDENT">
        <StudentRoutes />
      </ProtectedRoute>
    ),
  },
]);