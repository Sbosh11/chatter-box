import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../components/store/useAuthStore.js";
import { User, Settings, LogOut, Edit2 } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-800">
      {/* Left: Brand Name */}
      <Link to="/" className="text-xl font-bold text-blue-600 dark:text-white">
        Chatter-Box
      </Link>

      {/* Right: Authenticated Menu */}
      {authUser && (
        <div className="flex items-center gap-6 text-gray-700 dark:text-white">
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:text-blue-500"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 hover:text-blue-500"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
