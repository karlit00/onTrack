import API from "./client";

export const getHabits = () =>
  API.get("/habits").then(res => res.data);

export const createHabit = (data) =>
  API.post("/habits", data).then(res => res.data);

export const updateHabit = (id, data) =>
  API.put(`/habits/${id}`, data).then(res => res.data);

export const patchHabit = (id, data) =>
  API.patch(`/habits/${id}`, data).then(res => res.data);

export const deleteHabit = (id) =>
  API.delete(`/habits/${id}`).then(res => res.data);