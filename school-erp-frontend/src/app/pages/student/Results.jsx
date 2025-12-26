import { useEffect, useState } from "react";
import { getMyResults } from "../../../services/studentApi";

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyResults()
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-600">Loading results...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        My Results
      </h1>

      {results.length === 0 ? (
        <p className="mt-4 text-slate-500">
          No results published yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {results.map((r, idx) => {
            const passed = r.marks >= r.exam.passMarks;

            return (
              <div
                key={idx}
                className="rounded bg-white p-4 shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {r.exam.name} – {r.exam.subject.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Max Marks: {r.exam.maxMarks}
                    </p>
                  </div>

                  <span
                    className={`rounded px-3 py-1 text-sm ${
                      passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {passed ? "PASS" : "FAIL"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-semibold">
                    {r.marks}
                  </p>
                  <p className="text-sm text-slate-500">
                    Pass Marks: {r.exam.passMarks}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
