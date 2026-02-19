import React, { useEffect, useState } from "react";
import axios from "../components/lib/axios.js"; // use axiosInstance with baseURL
import useAuthStore from "../components/store/useAuthStore.js";
import { useLocation } from "react-router-dom";

const MessagesPage = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const location = useLocation();

  // Sync selected chat with URL query parameter
  // Allows navigation from HomePage → MessagesPage with a preselected user

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromURL = params.get("user");

    if (userIdFromURL && users.length > 0) {
      const foundUser = users.find((u) => u._id === userIdFromURL);
      if (foundUser) {
        setSelectedUser(foundUser);
      }
    }
  }, [location.search, users]);

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      if (!authUser) return;

      try {
        setLoadingUsers(true);
        const res = await axios.get("/messages/users"); // uses axiosInstance baseURL
        if (Array.isArray(res.data)) setUsers(res.data);
        else setUsers([]);
      } catch (err) {
        console.error("Fetch users error:", err);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [authUser]);

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        setLoadingMessages(true);
        const res = await axios.get(`/messages/${selectedUser._id}`);
        if (Array.isArray(res.data))
          setMessages(res.data.reverse()); // oldest → newest
        else setMessages([]);
      } catch (err) {
        console.error("Fetch messages error:", err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await axios.post("/messages/message", {
        recipientId: selectedUser._id,
        text: newMessage,
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex h-[calc(100vh-60px)] text-white">
      {/* USERS PANEL */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <h2 className="p-3 font-semibold border-b border-gray-700">Chats</h2>

        {loadingUsers ? (
          <p className="p-3 text-gray-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-3 text-gray-400">
            No users found. Create another account to test messaging.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 cursor-pointer transition ${
                selectedUser?._id === user._id
                  ? "bg-[#293448]"
                  : "hover:bg-[#293448]"
              }`}
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-gray-400">{user.email}</div>
            </div>
          ))
        )}
      </div>

      {/* CHAT PANEL */}
      <div className="flex-1 flex flex-col bg-gray-800">
        {/* HEADER */}
        <div className="p-3 border-b border-gray-700 font-semibold bg-gray-800">
          {selectedUser ? selectedUser.username : "Select a chat"}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto">
          {!selectedUser ? (
            <p className="text-gray-400">Choose someone to start chatting</p>
          ) : loadingMessages ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-400">No messages yet</p>
          ) : (
            messages.map((msg) => {
              const isSender = msg.sender === authUser.id;

              return (
                <div
                  key={msg._id}
                  className={`mb-3 flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow ${
                      isSender
                        ? "bg-[#4064bf] text-white rounded-br-none"
                        : "bg-[#293448] text-white rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* INPUT */}
        {selectedUser && (
          <div className="p-3 border-t border-gray-700 flex gap-2 bg-gray-800">
            <input
              type="text"
              className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 focus:outline-none focus:border-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#4064bf] text-white px-4 rounded hover:bg-blue-500 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
