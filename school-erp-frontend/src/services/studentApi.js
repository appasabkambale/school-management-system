import api from "./api";

export const getStudents = async () => {
  const res = await api.get("/students");
  return res.data.data;
};

export const createStudent = async (payload) => {
  const res = await api.post("/students", payload);
  return res.data.data;
};

export const getMyAttendance = async () => {
  const res = await api.get("/attendance/student/me");
  return res.data.data;
};

export const getMyResults = async () => {
  const res = await api.get("/results/me");
  return res.data.data;
};

export const getMyFees = async () => {
  const res = await api.get("/payments/dues");
  return res.data.data;
};

export const getMyPayments = async () => {
  const res = await api.get("/payments/my");
  return res.data.data;
};
