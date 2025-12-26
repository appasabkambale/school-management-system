import api from "./api";

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  // ✅ CORRECT response parsing
  const { token, user } = res.data.data;

  // ✅ Save properly
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};
