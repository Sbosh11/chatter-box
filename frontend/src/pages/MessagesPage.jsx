import React, { useEffect, useState } from "react";
import axios from "../components/lib/axios.js"; // use axiosInstance with baseURL
import useAuthStore from "../components/store/useAuthStore.js";

const MessagesPage = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

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
    <div className="flex h-[calc(100vh-60px)]">
      {/* USERS PANEL */}
      <div className="w-1/4 border-r overflow-y-auto">
        <h2 className="p-3 font-semibold">Chats</h2>

        {loadingUsers ? (
          <p className="p-3 text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-3 text-gray-500">
            No users found. Create another account to test messaging.
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 cursor-pointer hover:bg-gray-100 ${
                selectedUser?._id === user._id ? "bg-gray-200" : ""
              }`}
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))
        )}
      </div>

      {/* CHAT PANEL */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="p-3 border-b font-semibold">
          {selectedUser ? selectedUser.username : "Select a chat"}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-3 overflow-y-auto">
          {!selectedUser ? (
            <p className="text-gray-500">Choose someone to start chatting</p>
          ) : loadingMessages ? (
            <p className="text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-2 max-w-xs p-2 rounded ${
                  msg.sender === authUser._id
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-300"
                }`}
              >
                {msg.content}
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        {selectedUser && (
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded p-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 rounded"
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
