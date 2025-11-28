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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8">

                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 mb-4">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-600 text-sm">Join us and get started today</p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={onSubmit} className="space-y-5">

                        {/* NAME */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Name
                            </label>
                            <div className={`relative ${focused === "name" ? "ring-2 ring-blue-500" : ""}`}>
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-blue-500" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <div className={`relative ${focused === "email" ? "ring-2 ring-blue-500" : ""}`}>
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-blue-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className={`relative ${focused === "password" ? "ring-2 ring-blue-500" : ""}`}>
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-blue-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>

                       
{/* ROLE SLIDING TOGGLE */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">
    Select Role
  </label>

  <div className="relative w-full bg-slate-50 border border-slate-300 rounded-full p-1 flex items-center">

    {/* Sliding Background */}
    <div
      className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-blue-600 transition-all duration-300 ease-in-out
        ${formData.role === "admin" ? "translate-x-full" : "translate-x-0"}
      `}
    />

    {/* Learner Button */}
    <button
      type="button"
      onClick={() => setFormData({ ...formData, role: "learner" })}
      className={`relative z-10 flex-1 py-2 text-center font-semibold transition-all
        ${formData.role === "learner" ? "text-white" : "text-slate-600"}
      `}
    >
      Learner
    </button>

    {/* Admin Button */}
    <button
      type="button"
      onClick={() => setFormData({ ...formData, role: "admin" })}
      className={`relative z-10 flex-1 py-2 text-center font-semibold transition-all
        ${formData.role === "admin" ? "text-white" : "text-slate-600"}
      `}
    >
      Admin
    </button>

  </div>
</div>



                        {/* ERROR */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                loading || !isFormValid
                                    ? "bg-blue-400 text-white cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            }`}
                        >
                            {loading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Registering...
                              </>
                            ) : (
                              "Create Account"
                            )}
                        </button>
                    </form>

                    {/* FOOTER */}
                    <p className="text-center text-slate-600 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
