import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import useAuthStore from "../components/store/useAuthStore";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { success, data, error } = await resetPassword(token, password);

    if (success) {
      toast.success(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      const message =
        error?.response?.data || error?.message || "Reset failed. Try again.";

      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 w-full">
        <div
          className="w-full max-w-sm p-6 rounded-lg shadow-lg
          bg-shark-950 bg-clip-padding backdrop-filter
          backdrop-blur-lg bg-opacity-0"
        >
          <h1 className="text-3xl font-semibold text-center text-white mb-6">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-left mb-1">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-2 border border-gray-600 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-white text-left mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-2 border border-gray-600 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white py-2 rounded
              hover:bg-sky-800 flex items-center justify-center"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
