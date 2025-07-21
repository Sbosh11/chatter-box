import { create } from "zustand";
import axiosInstance from "../lib/axios.js";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Check if user is authenticated (e.g. on page load)
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      // console.log("User authenticated:", res.data);
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
      //console.log(res);
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

  // Update Profile (optional example)
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
}));

export default useAuthStore;
