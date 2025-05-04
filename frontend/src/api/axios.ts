import axios from "axios";
import { useStore } from "../store/myStore";

const api = axios.create({
  withCredentials: true, // ✅ Ensure cookies (refresh token) are sent
});

// 🔹 Add Authorization token to requests
api.interceptors.request.use((config) => {
  const token = useStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Prevent multiple token refresh requests at the same time
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 Check if refresh token expired
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === "Refresh Token expired. Login Again"
    ) {
      console.log("🚨 Refresh token expired. Logging out...");
      useStore.getState().logout();
      return Promise.reject(error);
    }

    // 🔴 Prevent retry loop if user is already logged out
    if (!useStore.getState().accessToken) {
      console.log("🚨 No access token available. Logging out...");
      useStore.getState().logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // ✅ Prevent infinite loops

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            console.log("🔄 Refreshing access token...");

            // ✅ Attempt to refresh the access token
            const refreshResponse = await api.post(`/api/auth/refresh-token`);
            const newToken = refreshResponse.data.accessToken;

            if (!newToken) {
              throw new Error("No access token received!");
            }

            useStore.setState((state) => ({ ...state, accessToken: newToken }));
            return newToken;
          } catch (refreshError) {
            console.error("🔴 Refresh token failed:", refreshError);
            useStore.getState().logout(); // ✅ Call Zustand logout function
            throw refreshError;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // ✅ Retry request with new token
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
