import api from "./api";

export const getTeacherExams = async () => {
  const res = await api.get("/exams/teacher");
  return res.data.data;
};

export const getExamMarks = async (examId) => {
  const res = await api.get(`/marks/exam/${examId}`);
  return res.data.data;
};

export const submitMarks = async (payload) => {
  const res = await api.post("/marks", payload);
  return res.data;
};
