import api from "./api";

export const getTeachers = async () => {
  const res = await api.get("/teachers");
  return res.data.data;
};

export const createTeacher = async (payload) => {
  const res = await api.post("/teachers", payload);
  return res.data.data;
};
