import { NavLink } from "react-router-dom";
import { getUser } from "../services/auth";

const Sidebar = () => {
  const user = getUser();

  const menus = {
    ADMIN: [
      { label: "Dashboard", path: "/admin" },
      { label: "Students", path: "/admin/students" },
      { label: "Teachers", path: "/admin/teachers" },
      { label: "Fees", path: "/admin/fees" },
      { label: "Reports", path: "/admin/reports" },
    ],
    TEACHER: [
      { label: "Dashboard", path: "/teacher" },
      { label: "Attendance", path: "/teacher/attendance" },
      { label: "Attendance Summary", path: "/teacher/attendance-summary" },
      { label: "Marks", path: "/teacher/marks" },
      { label: "Marks Summary", path: "/teacher/marks-summary" },
    ],
    STUDENT: [
      { label: "Dashboard", path: "/student" },
      { label: "Attendance", path: "/student/attendance" },
      { label: "Results", path: "/student/results" },
      { label: "Fees", path: "/student/fees" },
      { label: "Payments", path: "/student/payments" },
    ],
  };

  return (
    <aside className="hidden w-64 flex-shrink-0 bg-slate-900 text-white md:block">
      <div className="p-6 text-xl font-bold">
        School ERP
      </div>

      <nav className="px-4 space-y-1">
        {menus[user.role].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded px-4 py-2 text-sm ${
                isActive
                  ? "bg-slate-700"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
