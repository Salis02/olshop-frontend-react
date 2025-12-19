import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../utils/toast";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error untuk field yang sedang diubah
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Phone validation (optional)
        if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10-15 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({}); // Clear previous errors

        // Prepare data untuk backend (exclude confirmPassword)
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            ...(formData.phone && { phone: formData.phone }), // Include phone jika ada
        };

        const result = await register(userData);

        if (result.success) {
            showToast.success('Registration successfully!')
            navigate('/');
        } else {
            setErrors({ submit: result.message });
            showToast.error(result.message)
        }

        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="your@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone Field (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="08123456789"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};