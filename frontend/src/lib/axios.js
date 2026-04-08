import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api", // ✅ uses Vite proxy
  withCredentials: true, // ✅ needed for cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});