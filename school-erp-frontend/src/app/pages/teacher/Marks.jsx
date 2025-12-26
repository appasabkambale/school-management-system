import { useEffect, useState } from "react";
import {
  getTeacherExams,
  getExamMarks,
  submitMarks,
} from "../../../services/marksApi";

const Marks = () => {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load teacher exams
  useEffect(() => {
    getTeacherExams().then(setExams);
  }, []);

  // Load marks when exam selected
  useEffect(() => {
    if (!examId) return;

    setLoading(true);
    const exam = exams.find((e) => e.id === examId);
    setSelectedExam(exam);

    getExamMarks(examId)
      .then((data) => {
        setStudents(
          data.map((m) => ({
            studentId: m.student.id,
            rollNumber: m.student.rollNumber,
            name: m.student.name,
            marks: m.marks ?? "",
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [examId, exams]);

  const updateMarks = (id, value) => {
    if (value < 0 || value > selectedExam.maxMarks) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === id ? { ...s, marks: value } : s
      )
    );
  };

  const handleSubmit = async () => {
    setMessage("");
    setLoading(true);

    try {
      await submitMarks({
        examId,
        records: students.map((s) => ({
          studentId: s.studentId,
          marks: Number(s.marks),
        })),
      });

      setMessage("Marks submitted successfully ✅");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to submit marks"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Enter Marks
      </h1>

      {/* Exam Selector */}
      <div className="mt-4 rounded bg-white p-4 shadow">
        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        >
          <option value="">Select Exam</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} – {e.subject.name} ({e.class.name}
              -{e.class.section})
            </option>
          ))}
        </select>
      </div>

      {/* Marks Table */}
      {students.length > 0 && selectedExam && (
        <div className="mt-6 rounded bg-white p-4 shadow">
          <p className="mb-3 text-sm text-slate-600">
            Max Marks: {selectedExam.maxMarks} | Pass:
            {selectedExam.passMarks}
          </p>

          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Roll</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center">Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.studentId} className="border-t">
                  <td className="p-2">{s.rollNumber}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={s.marks}
                      disabled={selectedExam.isPublished}
                      onChange={(e) =>
                        updateMarks(
                          s.studentId,
                          e.target.value
                        )
                      }
                      className="w-20 rounded border px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            disabled={loading || selectedExam.isPublished}
            onClick={handleSubmit}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {selectedExam.isPublished
              ? "Marks Locked"
              : "Submit Marks"}
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-sm text-green-600">{message}</p>
      )}
    </div>
  );
};

export default Marks;
