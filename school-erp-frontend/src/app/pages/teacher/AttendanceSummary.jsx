import { useState } from "react";
import { getClassAttendance } from "../../../services/attendanceApi";

const AttendanceSummary = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    const data = await getClassAttendance(
      "classId",
      "subjectId",
      "date"
    );
    setRecords(data);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Attendance Summary
      </h1>

      <button
        onClick={fetchAttendance}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white"
      >
        Load Attendance
      </button>

      {loading && (
        <p className="mt-3 text-slate-600">Loading...</p>
      )}

      {records.length > 0 && (
        <div className="mt-6 rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Roll</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.student.id} className="border-t">
                  <td className="p-2">
                    {r.student.rollNumber}
                  </td>
                  <td className="p-2">{r.student.name}</td>
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

export default AttendanceSummary;
