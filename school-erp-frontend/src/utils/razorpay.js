import { verifyPayment } from "../services/paymentApi";

export const openRazorpayCheckout = async ({
  order,
  feeTitle,
  onSuccess,
  onFailure,
}) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount * 100, // paise
    currency: "INR",
    name: "School ERP",
    description: feeTitle,
    order_id: order.orderId,

    handler: async function (response) {
      try {
        await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        onSuccess();
      } catch (err) {
        onFailure(
          err.response?.data?.message ||
            "Payment verification failed"
        );
      }
    },

    modal: {
      ondismiss: function () {
        onFailure("Payment cancelled");
      },
    },

    theme: { color: "#2563eb" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
