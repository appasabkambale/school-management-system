import api from "./api";

export const getFees = async () => {
  const res = await api.get("/fees");
  return res.data.data;
};

export const createFee = async (payload) => {
  const res = await api.post("/fees", payload);
  return res.data.data;
};

export const assignFeeToClass = async (classId, feeStructureId) => {
  const res = await api.post(`/fees/assign/${classId}`, {
    feeStructureId,
  });
  return res.data;
};
