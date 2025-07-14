import React from "react";
import useAuthStore from "../components/store/useAuthStore.js";

const HomePage = () => {
  // const { authUser } = useAuthStore();
  const authUser = useAuthStore((state) => state.authUser);
  if (!authUser) {
    return null; // or return a fallback like <p>Please log in</p>
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to ChatApp</h1>
      <div className="space-y-2">
        <p>
          <strong>Username:</strong> {authUser.username}
        </p>
        <p>
          <strong>Email:</strong> {authUser.email}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
