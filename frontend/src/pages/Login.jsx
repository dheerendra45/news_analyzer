import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/auth";
import {
  Lock,
  Mail,
  User,
  AlertCircle,
  UserPlus,
  LogIn,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP State
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setOtpStep(false);
    setOtp("");
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.requestOTP(email, password);
      toast.success("OTP sent to your email!");
      setOtpStep(true);
    } catch (err) {
      const message = err.response?.data?.detail || "Invalid email or password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authAPI.verifyOTP(email, otp);

      // Use loginWithToken to set the token and user
      loginWithToken(data.access_token, data.user);
      toast.success(`Welcome back, ${data.user.username}!`);

      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.detail || "Invalid or expired OTP";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setOtpStep(false);
    setOtp("");
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate email domain
    const domain = email.split("@")[1]?.toLowerCase();
    if (!["replaceable.ai", "attacked.ai"].includes(domain)) {
      setError(
        "Admin registration requires @replaceable.ai or @attacked.ai email",
      );
      return;
    }

    setLoading(true);

    try {
      await authAPI.registerAdmin({ email, username, password });
      toast.success("Admin account created! Please sign in.");
      setIsRegister(false);
      resetForm();
      setEmail(email); // Keep email for convenience
    } catch (err) {
      const message = err.response?.data?.detail || "Registration failed";
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
          <p className="font-inter text-sm text-titanium mt-2">Admin Portal</p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => {
              setIsRegister(false);
              resetForm();
            }}
            className={`flex-1 py-3 font-inter text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
              !isRegister
                ? "bg-crimson text-white"
                : "bg-white/5 text-titanium hover:bg-white/10"
            }`}
          >
            <LogIn size={16} />
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              resetForm();
            }}
            className={`flex-1 py-3 font-inter text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
              isRegister
                ? "bg-crimson text-white"
                : "bg-white/5 text-titanium hover:bg-white/10"
            }`}
          >
            <UserPlus size={16} />
            Register
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8">
          {/* OTP Verification Step */}
          {otpStep ? (
            <>
              <button
                onClick={handleBackToLogin}
                className="flex items-center gap-2 text-titanium hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                <span className="font-inter text-sm">Back to Login</span>
              </button>

              <h2 className="font-playfair text-2xl text-white mb-2">
                Enter Verification Code
              </h2>
              <p className="font-crimson text-titanium mb-8">
                We've sent a 6-digit OTP to{" "}
                <span className="text-crimson">{email}</span>
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 mb-6 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span className="font-inter text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="font-inter text-xs font-semibold uppercase tracking-wider text-mist mb-2 block">
                    OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Enter 6-digit OTP"
                      required
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500 tracking-widest text-center text-xl"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-4 bg-crimson text-white font-inter text-sm font-semibold uppercase tracking-wider hover:bg-deep-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <KeyRound size={16} />
                      Verify & Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="font-inter text-xs text-mist mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRequestOTP(e);
                  }}
                  disabled={loading}
                  className="font-inter text-xs text-crimson hover:text-white transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-playfair text-2xl text-white mb-2">
                {isRegister ? "Create Admin Account" : "Welcome Back"}
              </h2>
              <p className="font-crimson text-titanium mb-8">
                {isRegister
                  ? "Register with your @replaceable.ai or @attacked.ai email"
                  : "Sign in to access the admin dashboard"}
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 mb-6 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span className="font-inter text-sm">{error}</span>
                </div>
              )}

              <form
                onSubmit={isRegister ? handleRegister : handleRequestOTP}
                className="space-y-5"
              >
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
                      placeholder={
                        isRegister
                          ? "you@replaceable.ai or you@attacked.ai"
                          : "admin@replaceable.ai"
                      }
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Username (Register only) */}
                {isRegister && (
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
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                )}

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
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Confirm Password (Register only) */}
                {isRegister && (
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
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-crimson transition-colors placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-crimson text-white font-inter text-sm font-semibold uppercase tracking-wider hover:bg-deep-crimson transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isRegister ? "Creating Account..." : "Sending OTP..."}
                    </>
                  ) : (
                    <>
                      {isRegister ? <UserPlus size={16} /> : <Mail size={16} />}
                      {isRegister ? "Create Admin Account" : "Send OTP"}
                    </>
                  )}
                </button>
              </form>

              {/* Info */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="font-inter text-xs text-mist text-center mb-3">
                  {isRegister ? "Allowed Email Domains" : "Secure Login"}
                </p>
                {isRegister ? (
                  <div className="bg-white/5 p-4 font-mono text-xs text-titanium space-y-1">
                    <div>• @replaceable.ai</div>
                    <div>• @attacked.ai</div>
                  </div>
                ) : (
                  <p className="font-inter text-xs text-titanium text-center">
                    A 6-digit verification code will be sent to your email for
                    secure authentication.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
