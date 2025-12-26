import api from "./api";

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data.data;
};

export const getPaymentSummary = async () => {
  const res = await api.get("/payments/report/summary");
  return res.data.data;
};
