import React, { useEffect, useState } from "react";
import axios from "../components/lib/axios.js";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../components/store/useAuthStore.js";

const HomePage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/messages/users");

        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.warn("Unexpected users response:", res.data);
          setUsers([]);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [authUser]);

  if (!authUser) return null;

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gray-900 rounded-xl p-5 mb-6 shadow">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {authUser.username}
        </h1>
        <div className="flex items-center gap-4">
          <img
            src={authUser.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <p className="text-gray-300">{authUser.email}</p>
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="bg-gray-900 rounded-xl p-5 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contacts</h2>
          <button
            onClick={() => navigate("/messages")}
            className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            Open Messages
          </button>
        </div>

        {loadingUsers ? (
          <p className="text-gray-400">Loading contacts...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400">No users found</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/messages?user=${user._id}`)}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{user.username}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
