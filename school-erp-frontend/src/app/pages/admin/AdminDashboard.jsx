const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Admin Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">Students</p>
          <p className="text-3xl font-bold">320</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
