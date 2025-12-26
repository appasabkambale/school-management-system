import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import Attendance from "../pages/teacher/Attendance";
import Marks from "../pages/teacher/Marks";

const TeacherRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="marks" element={<Marks />} />
      </Routes>
    </DashboardLayout>
  );
};

export default TeacherRoutes;
