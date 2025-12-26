import { useEffect, useState } from "react";
import {
  getTeacherClasses,
  getTeacherSubjects,
  getStudentsByClass,
  getClassAttendance,
  updateAttendance,
} from "../../../services/attendanceApi";

const today = new Date().toISOString().split("T")[0];

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------------------------
     Load teacher classes
  ---------------------------- */
  useEffect(() => {
    getTeacherClasses().then(setClasses);
  }, []);

  /* ---------------------------
     Load subjects when class changes
  ---------------------------- */
  useEffect(() => {
    if (!form.classId) return;

    setSubjects([]);
    setStudents([]);
    setForm((prev) => ({ ...prev, subjectId: "" }));
    setMessage("");

    getTeacherSubjects(form.classId).then(setSubjects);
  }, [form.classId]);

  /* ---------------------------
     Load attendance or students
  ---------------------------- */
  useEffect(() => {
    if (!form.classId || !form.subjectId || !form.date) return;

    setLoading(true);
    setMessage("");

    getClassAttendance(form.classId, form.subjectId, form.date)
      .then((records) => {
        if (records.length > 0) {
          // Attendance already exists
          setStudents(
            records.map((r) => ({
              id: r.student.id,
              rollNumber: r.student.rollNumber,
              name: r.student.name,
              present: r.status === "PRESENT",
            }))
          );
        } else {
          // No attendance yet → load students
          return getStudentsByClass(form.classId).then((data) =>
            setStudents(
              data.map((s) => ({
                id: s.id,
                rollNumber: s.rollNumber,
                name: s.name,
                present: true,
              }))
            )
          );
        }
      })
      .finally(() => setLoading(false));
  }, [form.classId, form.subjectId, form.date]);

  /* ---------------------------
     Toggle attendance
  ---------------------------- */
  const toggleAttendance = (id) => {
    if (form.date !== today) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: !s.present } : s
      )
    );
  };

  /* ---------------------------
     Submit / Update attendance
  ---------------------------- */
  const handleSubmit = async () => {
    if (form.date !== today) return;

    setLoading(true);
    setMessage("");

    try {
      await updateAttendance({
        classId: form.classId,
        subjectId: form.subjectId,
        date: form.date,
        records: students.map((s) => ({
          studentId: s.id,
          status: s.present ? "PRESENT" : "ABSENT",
        })),
      });

      setMessage("Attendance saved successfully ✅");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Attendance update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Mark Attendance
      </h1>

      {/* Selection */}
      <div className="mt-4 rounded bg-white p-4 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={form.classId}
            onChange={(e) =>
              setForm({ ...form, classId: e.target.value })
            }
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}-{c.section}
              </option>
            ))}
          </select>

          <select
            value={form.subjectId}
            onChange={(e) =>
              setForm({ ...form, subjectId: e.target.value })
            }
            disabled={!subjects.length}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            className="rounded border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-slate-600">Loading...</p>
      )}

      {students.length > 0 && (
        <div className="mt-6 rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Roll</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center">Present</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.rollNumber}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={s.present}
                      disabled={form.date !== today}
                      onChange={() => toggleAttendance(s.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            disabled={loading || form.date !== today}
            onClick={handleSubmit}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {form.date === today
              ? "Save Attendance"
              : "Attendance Locked"}
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-sm text-green-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default Attendance;

