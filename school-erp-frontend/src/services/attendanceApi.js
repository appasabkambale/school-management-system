import api from "./api";

export const getTeacherClasses = async () => {
  const res = await api.get("/teachers/me/classes");
  return res.data.data;
};

export const getTeacherSubjects = async (classId) => {
  const res = await api.get(
    `/teachers/me/subjects?classId=${classId}`
  );
  return res.data.data;
};

export const getStudentsByClass = async (classId) => {
  const res = await api.get(`/students/class/${classId}`);
  return res.data.data;
};

export const markAttendance = async (payload) => {
  const res = await api.post("/attendance", payload);
  return res.data;
};

export const getClassAttendance = async (
  classId,
  subjectId,
  date
) => {
  const res = await api.get(
    `/attendance/class/${classId}?subjectId=${subjectId}&date=${date}`
  );
  return res.data.data;
};

export const updateAttendance = async (payload) => {
  const res = await api.put("/attendance", payload);
  return res.data;
};

