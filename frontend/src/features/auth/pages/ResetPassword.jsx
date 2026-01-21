import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Loader } from 'lucide-react';
import AuthService from '../services/AuthService';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            setValidating(true);
            
            if (!token) {
                setError('Invalid reset link. Please request a new password reset.');
                setValidating(false);
                return;
            }

            try {
                const result = await AuthService.verifyResetToken(token);
                
                if (result.valid) {
                    setUserEmail(result.email);
                    setError('');
                } else {
                    setError(result.error || 'Invalid or expired reset link. Please request a new password reset.');
                }
            } catch (err) {
                setError('Failed to validate reset link. Please try again.');
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setValidationErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setValidationErrors({});

        // Validation
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setValidationErrors({ password: passwordErrors });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!token) {
            setError("Invalid reset token");
            return;
        }

        setLoading(true);

        try {
            const result = await AuthService.resetPassword(token, formData.password);
            
            if (result.success) {
                setMessage(result.message);
                setTimeout(() => {
                    navigate('/login', { 
                        state: { message: 'Password reset successful! Please login with your new password.' }
                    });
                }, 2000);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { label: '', color: '', width: '0%' };
        
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
        if (strength <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Show validating state
    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
                <div className="max-w-md w-full">
                    <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 mb-4">
                            <Loader className="w-7 h-7 text-white animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Validating Link</h1>
                        <p className="text-slate-600">Please wait while we verify your reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if token is invalid
    if (error && validating === false && !token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
                <div className="max-w-md w-full">
                    <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
                                <AlertCircle className="w-7 h-7 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
                        </div>
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                        <a
                            href="/forgot-password"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                        >
                            Request New Reset Link
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
            <div className="max-w-md w-full">
                <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 mb-4">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
                        <p className="text-slate-600 text-sm">
                            Create a strong password for your account
                        </p>
                        {userEmail && (
                            <p className="text-slate-500 text-xs mt-2">
                                Resetting password for: <span className="font-medium">{userEmail}</span>
                            </p>
                        )}
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-green-800 text-sm font-medium">{message}</p>
                                <p className="text-green-600 text-xs mt-1">Redirecting to login...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                    disabled={loading || !token}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-600">Password strength:</span>
                                        <span className={`text-xs font-medium ${
                                            passwordStrength.label === 'Strong' ? 'text-green-600' :
                                            passwordStrength.label === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: passwordStrength.width }}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {/* Validation Errors */}
                            {validationErrors.password && (
                                <ul className="mt-2 space-y-1">
                                    {validationErrors.password.map((err, idx) => (
                                        <li key={idx} className="text-xs text-red-600 flex items-center gap-1">
                                            <span>•</span> {err}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                    disabled={loading || !token}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-xs font-medium text-blue-900 mb-2">Password must contain:</p>
                            <ul className="space-y-1 text-xs text-blue-700">
                                <li className="flex items-center gap-2">
                                    <span className={formData.password.length >= 6 ? 'text-green-600' : ''}>•</span>
                                    At least 6 characters
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>•</span>
                                    One uppercase letter
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>•</span>
                                    One lowercase letter
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>•</span>
                                    One number
                                </li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token || !formData.password || !formData.confirmPassword}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Reset Password
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;