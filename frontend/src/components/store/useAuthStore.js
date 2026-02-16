import { create } from "zustand";
import axiosInstance from "../lib/axios.js";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Check if user is authenticated
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup
  signup: async (userInfo) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", userInfo);
      const { user, token } = res.data;

      set({ authUser: user });

      return { success: true, user, token };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error };
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login
  login: async (credentials) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      const { user, token } = res.data;

      set({ authUser: user });

      return { success: true, user, token };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      set({ authUser: null });
    }
  },

  // Update Profile
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ authUser: res.data.user });

      return { success: true };
    } catch (error) {
      console.error("Profile update failed:", error);
      return { success: false, error };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", {
        email,
      });

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Forgot password failed:", error);
      return { success: false, error };
    }
  },

  // Reset Password

  resetPassword: async (token, password) => {
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Reset password failed:", error);
      return { success: false, error };
    }
  },
}));

export default useAuthStore;
