import React from "react";
import useAuthStore from "../components/store/useAuthStore.js";
import { User, Settings, LogOut } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-900">
      {/* Left: Brand Name */}
      <div className="text-xl font-bold text-blue-600 dark:text-white">
        Chatter-Box
      </div>

      {/* Right: Logged-in Actions */}
      {authUser && (
        <div className="flex items-center gap-6 text-gray-700 dark:text-white">
          <button className="flex items-center gap-2 hover:text-blue-500">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={logout}
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
