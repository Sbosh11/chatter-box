import { useState } from "react";
import useAuthStore from "../components/store/useAuthStore.js";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      return "All fields are required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error); // replace with toast/snackbar if preferred
      return;
    }
    signup(formData); // assuming your store handles side effects
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-shark-950 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          {/* Form Header */}
          <h1 className="text-3xl font-semibold text-center text-white mb-6">
            Sign Up for <span className="text-blue-500">ChatApp</span>
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-left">Username</label>
              <input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                type="text"
                placeholder="Enter your username"
                className="w-full p-2 border border-gray-600 rounded"
              />
            </div>

            <div>
              <label className="block text-white text-left">Email</label>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-600 rounded"
              />
            </div>

            <div className="relative">
              <label className="block text-white text-left mb-1">Password</label>
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
              disabled={isSigningUp}
              className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-800 flex items-center justify-center"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Signing Up...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-white">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
