// pages/admin/components/AddFeeModal.jsx
import { useState } from "react";
import { createFee } from "../../../../services/feeApi";

const AddFeeModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    academicYear: "",
    dueDate: "",
    classId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createFee({
        ...form,
        amount: Number(form.amount),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded bg-white p-6 shadow"
      >
        <h2 className="mb-4 text-lg font-semibold">
          Create Fee Structure
        </h2>

        {error && (
          <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {[
          "title",
          "amount",
          "academicYear",
          "dueDate",
          "classId",
        ].map((field) => (
          <div key={field} className="mb-3">
            <label className="text-sm text-slate-600 capitalize">
              {field}
            </label>
            <input
              type={
                field === "amount"
                  ? "number"
                  : field === "dueDate"
                  ? "date"
                  : "text"
              }
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFeeModal;
