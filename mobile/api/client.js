import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: "https://ontrack-wo5i.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
  }

  return config;
});

// Centralized error handler
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);
    }

    return Promise.reject(
      error.response?.data || { message: error.message }
    );
  }
);

export default API;