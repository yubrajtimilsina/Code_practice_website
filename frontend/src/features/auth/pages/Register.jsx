import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../slice/authSlice.js";
import { Mail, Lock, User, CheckCircle2, AlertCircle } from "lucide-react";

export default function Register() {
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "learner",
    });

    const [focused, setFocused] = useState(null);

    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

    useEffect(() => {
   if (user) {
    if (user.role === "super-admin") {
      navigate("/dashboard/super-admin");
    } else if (user.role === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/learner");
    }
  }
}, [user, navigate]);

    const isFormValid = formData.name && formData.email && formData.password;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">

                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-purple-200 text-sm">Join us and get started today</p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={onSubmit} className="space-y-5">

                        {/* NAME */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Name
                            </label>
                            <div className={`relative ${focused === "name" ? "ring-2 ring-purple-500" : ""}`}>
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Email
                            </label>
                            <div className={`relative ${focused === "email" ? "ring-2 ring-purple-500" : ""}`}>
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-2">
                                Password
                            </label>
                            <div className={`relative ${focused === "password" ? "ring-2 ring-purple-500" : ""}`}>
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none"
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>

                        {/* ROLE SELECT */}
                        {/* ROLE SWITCH */}
{/* ROLE SLIDING TOGGLE */}
<div>
  <label className="block text-sm font-medium text-purple-200 mb-2">
    Select Role
  </label>

  <div className="relative w-full bg-white/5 border border-white/10 rounded-full p-1 flex items-center">

    {/* Sliding Background */}
    <div
      className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-in-out
        ${formData.role === "admin" ? "translate-x-full" : "translate-x-0"}
      `}
    />

    {/* Learner Button */}
    <button
      type="button"
      onClick={() => setFormData({ ...formData, role: "learner" })}
      className={`relative z-10 flex-1 py-2 text-center font-semibold transition-all
        ${formData.role === "learner" ? "text-white" : "text-purple-300"}
      `}
    >
      Learner
    </button>

    {/* Admin Button */}
    <button
      type="button"
      onClick={() => setFormData({ ...formData, role: "admin" })}
      className={`relative z-10 flex-1 py-2 text-center font-semibold transition-all
        ${formData.role === "admin" ? "text-white" : "text-purple-300"}
      `}
    >
      Admin
    </button>

  </div>
</div>



                        {/* ERROR */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                loading || !isFormValid
                                    ? "bg-purple-500/50 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            }`}
                        >
                            {loading ? "Registering..." : "Create Account"}
                        </button>
                    </form>

                    {/* FOOTER */}
                    <p className="text-center text-purple-200 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-purple-400 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
