import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../api/axios";
interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => {
        set({ accessToken: null, isAuthenticated: false, user: null });
        // window.location.href = "/login"; // 🔹 Redirect to login immediately
      },
      login: async (email, password) => {
        try {
          const loginResponse = await axios.post(
            `${import.meta.env.VITE_BASEURL}/auth/login`,
            { email, password }
          );

          if (loginResponse.status === 200) {
            const token = loginResponse.data.accessToken;
            console.log("🔑 Received token:", token);

            set({ accessToken: token }); // ✅ Store token before next request

            const authResponse = await axios.get(
              `${import.meta.env.VITE_BASEURL}/auth/check-auth`,
              { withCredentials: true }
            );

            set({ user: authResponse.data.user, isAuthenticated: true });
          }
        } catch (error: any) {
          console.error(
            "Login failed:",
            error.response?.data?.error || "Invalid credentials"
          );
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },
    }),
    { name: "auth-storage" }
  )
);
