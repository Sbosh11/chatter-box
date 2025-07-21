import React, { useState, useRef, useEffect } from "react";
import useAuthStore from "../components/store/useAuthStore.js";

const ProfilePage = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);

  // Hooks at top level — initialize with authUser or empty defaults
  const [username, setUsername] = useState(authUser?.username || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [profilePic, setProfilePic] = useState(authUser?.profilePicture || "");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [error, setError] = useState(null);

  // Sync local state when authUser changes
  useEffect(() => {
    if (authUser) {
      setUsername(authUser.username);
      setEmail(authUser.email);
      setProfilePic(authUser.profilePicture || "");
    }
  }, [authUser]);

  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePic(event.target.result); // base64 preview
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };

  const onSave = async () => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (profilePicFile) {
        formData.append("profilePicture", profilePicFile);
      }

      const result = await updateProfile(formData);

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to update profile");
      }

      alert("Profile updated successfully.");
      setIsEditing(false); // Exit edit mode after saving
    } catch (err) {
      setError(err.message);
    }
  };

  const onEdit = () => {
    setIsEditing(true); // Enter edit mode
  };

  if (!authUser) return <p>Please log in to view profile.</p>;

  return (
    <div className="p-6 max-w-md mx-auto text-white bg-gray-900 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="flex items-center justify-center flex-col mb-4 ">
        <img
          src={profilePic || "https://i.pravatar.cc/300"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-2 border border-gray-700"
        />
        <button
          onClick={openFilePicker}
          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition"
          type="button"
        >
          Upload Picture / Use Camera
        </button>
        <input
          type="file"
          accept="image/*"
          capture="user"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setProfilePicFile(e.target.files[0])}
        />
      </div>

      {/* Username */}
      <label className="block mb-3 font-semibold">
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 mt-1 text-white"
          disabled={!isEditing} // Disable when not editing
        />
      </label>

      {/* Email */}
      <label className="block mb-4 font-semibold">
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 mt-1 text-white"
          disabled={!isEditing} // Disable when not editing
        />
      </label>

      {/* Account info */}
      <div className="mb-6">
        <p>
          <strong>Member since:</strong> {formatDate(authUser.createdAt)}
        </p>
        <p>
          <strong>Status:</strong> {authUser.status || "inactive"}
        </p>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Buttons to Edit/Save */}
      <div className="flex gap-4">
        <button
          onClick={onEdit}
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
        >
          Edit
        </button>

        {isEditing && (
          <button
            onClick={onSave}
            disabled={isUpdatingProfile}
            className={`w-full py-2 rounded ${
              isUpdatingProfile
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } transition`}
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
