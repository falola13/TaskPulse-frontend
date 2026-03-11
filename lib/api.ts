import axios, { AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const TOKEN_NAME = "access_token";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: attach JWT from js-cookie as Authorization header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_NAME);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle Expiry/Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 means the token is invalid or expired
    if (error.response?.status === 401) {
      // Remove the token from js-cookie so the client-side view updates on next render
      Cookies.remove(TOKEN_NAME);

      // Redirect to login if we're on the client
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
