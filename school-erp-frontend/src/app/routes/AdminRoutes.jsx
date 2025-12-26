import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Students from "../pages/admin/Students";
import Teachers from "../pages/admin/Teachers";
import Fees from "../pages/admin/Fees";
import Reports from "../pages/admin/Reports";

const AdminRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="fees" element={<Fees />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminRoutes;
