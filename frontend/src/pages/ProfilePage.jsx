import React, { useRef, useState, useEffect } from "react";
import useAuthStore from "../components/store/useAuthStore";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

  // -----------------------------
  // Local state
  // -----------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // -----------------------------
  // Populate fields when authUser loads
  // -----------------------------
  useEffect(() => {
    if (authUser) {
      setUsername(authUser.username);
      setEmail(authUser.email);
      setProfilePic(authUser.profilePicture);
    }
  }, [authUser]);

  // -----------------------------
  // Handle Edit mode
  // -----------------------------
  const onEdit = () => {
    setIsEditing(true);
    setError("");
  };

  const onCancel = () => {
    setIsEditing(false);
    setPreview(null);
    setProfilePicFile(null);
    setError("");

    // Restore original values
    if (authUser) {
      setUsername(authUser.username);
      setEmail(authUser.email);
      setProfilePic(authUser.profilePicture);
    }
  };

  // -----------------------------
  // Open file picker
  // -----------------------------
  const openFilePicker = () => {
    if (!isEditing) return;
    fileInputRef.current.click();
  };

  // -----------------------------
  // Handle image selection
  // -----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePicFile(file);

    // Instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // -----------------------------
  // Save profile
  // -----------------------------
  const onSave = async () => {
    setError("");

    if (!isEditing) return;

    // Prevent empty update
    if (!username && !email && !profilePicFile) {
      setError("Nothing to update");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);

    if (profilePicFile) {
      formData.append("profilePicture", profilePicFile);
    }

    const result = await updateProfile(formData);

    if (!result.success) {
      setError("Failed to update profile");
      return;
    }

    setIsEditing(false);
    setPreview(null);
    setProfilePicFile(null);
  };

  // -----------------------------
  // Remove profile photo
  // -----------------------------
  const removePhoto = () => {
    if (!isEditing) return;

    setPreview(null);
    setProfilePicFile(null);
    setProfilePic(null);
  };

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* ----------------------------- */}
      {/* Profile Picture */}
      {/* ----------------------------- */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={preview || profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border border-gray-700 mb-3"
        />

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          capture="user"
          ref={fileInputRef}
          style={{ display: "none" }}
          disabled={!isEditing} // ✅ locked when not editing
          onChange={handleImageChange}
        />

        {/* Upload Button */}
        <button
          onClick={openFilePicker}
          disabled={!isEditing}
          className={`px-3 py-1 rounded transition ${
            isEditing
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          type="button"
        >
          Upload Picture / Use Camera
        </button>

        {/* Remove Photo Button */}
        {isEditing && (
          <button
            onClick={removePhoto}
            className="mt-2 text-sm text-red-400 hover:text-red-300"
            type="button"
          >
            Remove photo
          </button>
        )}
      </div>

      {/* ----------------------------- */}
      {/* Username */}
      {/* ----------------------------- */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Username</label>
        <input
          type="text"
          value={username}
          disabled={!isEditing}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-2 rounded bg-gray-800 border ${
            isEditing ? "border-gray-600" : "border-gray-700 opacity-60"
          }`}
        />
      </div>

      {/* ----------------------------- */}
      {/* Email */}
      {/* ----------------------------- */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled={!isEditing}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 rounded bg-gray-800 border ${
            isEditing ? "border-gray-600" : "border-gray-700 opacity-60"
          }`}
        />
      </div>

      {/* ----------------------------- */}
      {/* Buttons */}
      {/* ----------------------------- */}
      <div className="flex gap-3">
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              disabled={isUpdatingProfile}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* ----------------------------- */}
      {/* Error */}
      {/* ----------------------------- */}
      {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
    </div>
  );
};

export default ProfilePage;
