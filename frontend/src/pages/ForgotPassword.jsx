import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import useAuthStore from "../components/store/useAuthStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    const { success, data, error } = await forgotPassword(email);

    if (success) {
      toast.success(data.message);
      setEmail("");
    } else {
      const message =
        error?.response?.data || error?.message || "Failed to send reset link";

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
            Forgot Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-left mb-1">Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-600 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white py-2 rounded
              hover:bg-sky-800 flex items-center justify-center"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
