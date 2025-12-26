import { useEffect, useState } from "react";
import { getMyPayments } from "../../../services/studentApi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPayments()
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-slate-600">
        Loading payment history...
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        Payment History
      </h1>

      {payments.length === 0 ? (
        <p className="mt-4 text-slate-500">
          No payments found.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {payments.map((p) => (
            <div
              key={p.paymentId}
              className="rounded border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {p.feeTitle}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Academic Year: {p.academicYear}
                  </p>
                </div>

                <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                  PAID
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                <p>
                  <span className="text-slate-500">Amount:</span>{" "}
                  ₹{p.amount}
                </p>
                <p>
                  <span className="text-slate-500">Paid On:</span>{" "}
                  {new Date(p.paidAt).toLocaleString()}
                </p>
                <p>
                  <span className="text-slate-500">
                    Payment ID:
                  </span>{" "}
                  {p.paymentId}
                </p>
                <p>
                  <span className="text-slate-500">
                    Order ID:
                  </span>{" "}
                  {p.orderId}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
