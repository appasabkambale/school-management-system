const StudentDashboard = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Welcome 👋
      </h1>

      <p className="mt-2 text-slate-600">
        Track your attendance, results, and fees here.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Attendance</p>
          <p className="mt-2 text-lg font-medium">
            View attendance history
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Results</p>
          <p className="mt-2 text-lg font-medium">
            View exam results
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Fees</p>
          <p className="mt-2 text-lg font-medium">
            View dues & payments
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

