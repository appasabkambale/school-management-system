import { useEffect, useState } from "react";
import { getMyAttendance } from "../../../services/studentApi";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAttendance()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-600">Loading attendance...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        My Attendance
      </h1>

      {records.length === 0 ? (
        <p className="mt-4 text-slate-500">
          No attendance records found.
        </p>
      ) : (
        <div className="mt-6 rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{r.subject.name}</td>
                  <td className="p-2 text-center">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        r.status === "PRESENT"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
