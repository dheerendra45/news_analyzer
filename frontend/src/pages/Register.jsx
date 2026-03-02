import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/auth";
import { User, Mail, Lock, AlertCircle, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Register the user
      await authAPI.register({ email, username, password });
      toast.success("Account created successfully!");

      // Auto-login after registration
      try {
        await login(email, password);
        navigate("/", { replace: true });
      } catch (loginErr) {
        // If auto-login fails, redirect to login page
        toast.success("Please login with your new account");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.detail || "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl text-white">
            Replace<span className="text-crimson">able</span>.ai
          </h1>
          <p className="font-inter text-sm text-titanium mt-2">
            Create Your Account
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8">
          <h2 className="font-playfair text-2xl text-white mb-2">
            Get Started
          </h2>
          <p className="font-crimson text-titanium mb-8">
            Register to access intelligence reports & news
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 mb-6 flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="font-inter text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username */}
            <div>
              <label className="font-inter text-xs font-semibold uppercase tracking-wider text-mist mb-2 block">
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  minLength={3}
                  maxLength={50}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-inter text-xs font-semibold uppercase tracking-wider text-mist mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-inter text-xs font-semibold uppercase tracking-wider text-mist mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-inter text-xs font-semibold uppercase tracking-wider text-mist mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-crimson text-white font-inter text-sm font-semibold uppercase tracking-wider hover:bg-deep-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="font-inter text-sm text-titanium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-crimson hover:text-white transition-colors font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
