import { useEffect, useState } from "react";
import { getFees, assignFeeToClass } from "../../../services/feeApi";
import AddFeeModal from "./components/AddFeeModal";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // React 19–safe data loading
  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      try {
        const data = await getFees();
        if (isMounted) {
          setFees(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAssign = async (feeId, classId) => {
    try {
      await assignFeeToClass(classId, feeId);
      alert("Fee assigned to class");
    } catch {
      alert("Failed to assign fee");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">
          Fee Management
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + Create Fee
        </button>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading fees...</p>
      ) : (
        <div className="overflow-x-auto rounded bg-white shadow">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Class</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr
                  key={f.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-3">{f.title}</td>
                  <td className="p-3">₹{f.amount}</td>
                  <td className="p-3">
                    {f.class.name}-{f.class.section}
                  </td>
                  <td className="p-3">
                    {new Date(f.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleAssign(f.id, f.classId)
                      }
                      className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddFeeModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Fees;
