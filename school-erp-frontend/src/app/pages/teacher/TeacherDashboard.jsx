import DashboardLayout from "../../layouts/DashboardLayout";

const TeacherDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">
        Welcome Teacher 👋
      </h1>

      <p className="mt-2 text-slate-600">
        Select a class to mark attendance or enter marks.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-medium">Attendance</h3>
          <p className="mt-1 text-sm text-slate-500">
            Mark daily student attendance
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-medium">Marks</h3>
          <p className="mt-1 text-sm text-slate-500">
            Enter exam marks for students
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
