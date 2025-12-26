import api from "./api";

export const createPaymentOrder = async (feeDueId) => {
  const res = await api.post("/payments/create-order", {
    feeDueId,
  });
  return res.data;
};

export const verifyPayment = async (payload) => {
  const res = await api.post("/payments/verify", payload);
  return res.data;
};
