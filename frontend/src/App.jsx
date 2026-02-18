import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./components/store/useAuthStore.js";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Navbar from "./components/Navbar";
import MessagesPage from "./pages/MessagesPage.jsx";
import { Loader } from "lucide-react";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  // const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const authUser = useAuthStore((state) => state.authUser);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("App rendered with authUser:", authUser);
  }, [authUser]);

  if (isCheckingAuth && !authUser) {
    return <Loader className="size-10 animate-spin m-auto" />;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/messages"
          element={authUser ? <MessagesPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}
export default App;
