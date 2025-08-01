import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  import.meta.env.MODE === "development" ? "http://localhost:3000/api":"/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});