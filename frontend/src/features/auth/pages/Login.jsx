import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slice/authslice";
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const onSubmit = e => {
    e.preventDefault();
    dispatch(login(form));
  };

  const isFormValid = form.email && form.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-purple-200 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Email Address</label>
              <div className={`relative transition-all duration-300 ${focused === "email" ? "ring-2 ring-purple-500" : ""}`}>
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-purple-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={onChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none transition-all duration-300 hover:border-white/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
              <div className={`relative transition-all duration-300 ${focused === "password" ? "ring-2 ring-purple-500" : ""}`}>
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none transition-all duration-300 hover:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={onSubmit}
              disabled={loading || !isFormValid}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                loading || !isFormValid
                  ? "bg-purple-500/50 text-white/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-purple-200 text-sm mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}