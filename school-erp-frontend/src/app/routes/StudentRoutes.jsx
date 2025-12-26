import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import Attendance from "../pages/student/Attendance";
import Results from "../pages/student/Results";
import Fees from "../pages/student/Fees";

const StudentRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<StudentDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="results" element={<Results />} />
        <Route path="fees" element={<Fees />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentRoutes;
