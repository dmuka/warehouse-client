import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;