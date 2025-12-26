import { useState } from "react";
import { getExamMarks } from "../../../services/marksApi";

const MarksSummary = () => {
  const [marks, setMarks] = useState([]);

  const loadMarks = async () => {
    const data = await getExamMarks("examId");
    setMarks(data);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Marks Summary
      </h1>

      <button
        onClick={loadMarks}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white"
      >
        Load Marks
      </button>

      {marks.length > 0 && (
        <div className="mt-6 rounded bg-white p-4 shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Roll</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center">Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m) => (
                <tr key={m.student.id} className="border-t">
                  <td className="p-2">
                    {m.student.rollNumber}
                  </td>
                  <td className="p-2">{m.student.name}</td>
                  <td className="p-2 text-center">
                    {m.marks}
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

export default MarksSummary;
