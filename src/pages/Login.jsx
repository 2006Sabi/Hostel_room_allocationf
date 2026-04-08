import { useState, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import useFormValidation from '../hooks/useFormValidation';
import Toast from '../components/Toast';
import { User, Lock, ArrowRight, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const validate = useCallback((values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Enter a valid email address';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = 'Enter a valid email address';
        }

        if (!values.password) {
            errors.password = 'Password must contain at least 8 characters, one uppercase letter, and one special character';
        } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(values.password)) {
            errors.password = 'Password must contain at least 8 characters, one uppercase letter, and one special character';
        }
        return errors;
    }, []);

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid
    } = useFormValidation({ email: '', password: '' }, validate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        
        setAuthError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { 
                email: values.email, 
                password: values.password 
            });
            login(data, data.token);
            
            if (data.isFirstLogin) {
                setShowWelcome(true);
                // Delay navigation slightly to let the user see the toast, or navigate and let the toast persist?
                // Usually, we navigate and the toast persists if it's in a layout.
                // But here Toast is inside the component. Let's show it, wait 2s, then navigate.
                setTimeout(() => {
                    navigate('/student/dashboard');
                }, 2000);
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setAuthError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-blue-100 font-medium">Student Login Portal</p>
                </div>
                <div className="p-8">
                    {authError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 text-center flex items-center justify-center gap-2">
                            <AlertCircle size={18} />
                            {authError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className={`${touched.email ? (errors.email ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 transition-all outline-none ${
                                        touched.email 
                                            ? (errors.email 
                                                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                                : 'border-green-300 bg-green-50 focus:ring-green-500 focus:border-green-500')
                                            : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder="student@example.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.email && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {errors.email ? (
                                            <AlertCircle size={18} className="text-red-500" />
                                        ) : (
                                            <CheckCircle2 size={18} className="text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.email && errors.email && (
                                <p className="mt-1 text-xs text-red-500 font-medium ml-1">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className={`${touched.password ? (errors.password ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 transition-all outline-none ${
                                        touched.password 
                                            ? (errors.password 
                                                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                                : 'border-green-300 bg-green-50 focus:ring-green-500 focus:border-green-500')
                                            : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder="••••••••"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.password && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {errors.password ? (
                                            <AlertCircle size={18} className="text-red-500" />
                                        ) : (
                                            <CheckCircle2 size={18} className="text-green-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1 text-xs text-red-500 font-medium ml-1 leading-relaxed">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !isValid}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Register here
                        </Link>
                    </div>
                    <div className="mt-4 text-center text-xs text-gray-500">
                        <Link to="/admin-login" className="hover:text-blue-600 transition-colors">
                            Admin Login Portal
                        </Link>
                    </div>
                </div>
            </div>
            <Toast 
                isVisible={showWelcome} 
                message="Welcome! Your account has been successfully created." 
                onClose={() => setShowWelcome(false)}
            />
        </div>
    );
};

export default Login;
