import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyFees } from "../../../services/studentApi";
import {
  createPaymentOrder,
  verifyPayment,
} from "../../../services/paymentApi";
import { loadRazorpay } from "../../../utils/loadRazorpay";

const Fees = () => {
  const navigate = useNavigate();

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    setLoading(true);
    const data = await getMyFees();
    setFees(data);
    setLoading(false);
  };

useEffect(() => {
  let isMounted = true;

  (async () => {
    setLoading(true);
    try {
      const data = await getMyFees();
      if (isMounted) setFees(data);
    } finally {
      if (isMounted) setLoading(false);
    }
  })();

  return () => {
    isMounted = false;
  };
}, []);


  const handlePayNow = async (fee) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const order = await createPaymentOrder(fee.id);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount * 100, // paise
        currency: "INR",
        name: "School ERP",
        description: fee.feeStructure.title,
        order_id: order.orderId,

        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment successful 🎉");

            await fetchFees(); // refresh dues
            navigate("/student/payments");
          } catch (err) {
            alert(
              err.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      alert("Failed to initiate payment");
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading fees...</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">
        My Fees
      </h1>

      {fees.length === 0 ? (
        <p className="mt-4 text-slate-500">
          No fee dues found.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {fees.map((f) => (
            <div
              key={f.id}
              className="rounded bg-white p-4 shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {f.feeStructure.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Academic Year:{" "}
                    {f.feeStructure.academicYear}
                  </p>
                </div>

                <span
                  className={`rounded px-3 py-1 text-sm ${
                    f.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {f.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-semibold">
                  ₹{f.amount}
                </p>
                <p className="text-sm text-slate-500">
                  Due:{" "}
                  {new Date(f.dueDate).toLocaleDateString()}
                </p>
              </div>

              {f.status === "PENDING" && (
                <button
                  onClick={() => handlePayNow(f)}
                  className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fees;
