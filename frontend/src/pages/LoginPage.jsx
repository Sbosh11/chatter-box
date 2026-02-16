import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../components/store/useAuthStore.js";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ForgotPassword from "./ForgotPassword";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    const { emailOrUsername, password } = formData;

    if (!emailOrUsername.trim()) {
      toast.error("Email or Username is required");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { success, error } = await login(formData);

    if (success) {
      toast.success(`Welcome back!`);
      setFormData({ emailOrUsername: "", password: "" });
      setTimeout(() => navigate("/"), 1000);
    } else {
      const message =
        error?.response?.data ||
        error?.message ||
        "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-shark-950 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <h1 className="text-3xl font-semibold text-center text-white mb-6">
            Log In to <span className="text-blue-500">ChatApp</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-left">
                Email or Username
              </label>
              <input
                value={formData.emailOrUsername}
                onChange={(e) =>
                  setFormData({ ...formData, emailOrUsername: e.target.value })
                }
                type="text"
                placeholder="Enter your email or username"
                className="w-full p-2 border border-gray-600 rounded"
              />
            </div>

            <div className="relative">
              <label className="block text-white text-left mb-1">
                Password
              </label>
              <input
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full p-2 pr-10 border border-gray-600 rounded"
                type={showPassword ? "text" : "password"}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-800 flex items-center justify-center"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Logging In...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-white">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
            <p className="text-white">
              Forgot Password?{" "}
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Reset Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
