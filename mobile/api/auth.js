import API from "./client";

export const registerUser = (data) => {
  return API.post("/auth/signup", data).then(res => res.data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data).then(res => res.data);
};