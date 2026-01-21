import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, googleLogin } from "../slice/authSlice.js";
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, CheckCircle2, AlertCircle, Check, X, Eye, EyeOff } from "lucide-react";


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
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [passwordStrength, setPasswordStrength] = useState(null);

    // Validate password in real-time
    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 6) errors.push("Password must be at least 6 characters long");
        if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
        if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
        return errors;
    };

    // Calculate password strength
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
        if (strength <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" };
        return { label: "Strong", color: "bg-green-500", width: "100%" };
    };

    // Check password requirements
    const checkRequirements = (password) => {
        return {
            hasLength: password.length >= 6,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
        };
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Real-time password validation
        if (name === "password") {
            const errors = validatePassword(value);
            setPasswordErrors(errors);
            if (value.length > 0) {
                setPasswordStrength(getPasswordStrength(value));
            } else {
                setPasswordStrength(null);
            }
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };


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
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    required
                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-slate-400"
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 w-5 h-5 text-slate-500 hover:text-slate-700 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && passwordStrength && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-slate-600">Password strength:</span>
                                        <span className={`text-xs font-semibold ${
                                            passwordStrength.label === "Weak" ? "text-red-600" :
                                            passwordStrength.label === "Medium" ? "text-yellow-600" :
                                            "text-green-600"
                                        }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: passwordStrength.width }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password Requirements Checklist */}
                            {formData.password && (
                                <div className="mt-3 space-y-1 text-sm">
                                    {checkRequirements(formData.password).hasLength ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check size={16} className="flex-shrink-0" />
                                            <span>At least 6 characters</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <X size={16} className="flex-shrink-0" />
                                            <span>At least 6 characters</span>
                                        </div>
                                    )}

                                    {checkRequirements(formData.password).hasUppercase ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check size={16} className="flex-shrink-0" />
                                            <span>One uppercase letter (A-Z)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <X size={16} className="flex-shrink-0" />
                                            <span>One uppercase letter (A-Z)</span>
                                        </div>
                                    )}

                                    {checkRequirements(formData.password).hasLowercase ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check size={16} className="flex-shrink-0" />
                                            <span>One lowercase letter (a-z)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <X size={16} className="flex-shrink-0" />
                                            <span>One lowercase letter (a-z)</span>
                                        </div>
                                    )}

                                    {checkRequirements(formData.password).hasNumber ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check size={16} className="flex-shrink-0" />
                                            <span>One number (0-9)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <X size={16} className="flex-shrink-0" />
                                            <span>One number (0-9)</span>
                                        </div>
                                    )}
                                </div>
                            )}
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
                            className={`w-full py-3 rounded-lg font-semibold transition-all ${loading || !isFormValid
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

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-slate-500">Or sign up with</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    dispatch(googleLogin(credentialResponse.credential));
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </div>
                    </div>

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
