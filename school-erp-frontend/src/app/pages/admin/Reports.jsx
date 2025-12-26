import { useEffect, useState } from "react";
import StatCard from "../../../components/StatCard";
import { getAdminStats } from "../../../services/adminApi";
import { getPaymentSummary } from "../../../services/adminApi";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [adminStats, paymentStats] = await Promise.all([
          getAdminStats(),
          getPaymentSummary(),
        ]);
        setStats(adminStats);
        setPayments(paymentStats);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p className="text-slate-600">Loading reports...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Reports & Analytics
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
        />
        <StatCard
          title="Fees Assigned"
          value={`₹${payments.totalAssigned}`}
        />
        <StatCard
          title="Fees Collected"
          value={`₹${payments.totalCollected}`}
        />
        <StatCard
          title="Pending Fees"
          value={`₹${payments.pending}`}
        />
      </div>
    </div>
  );
};

export default Reports;
