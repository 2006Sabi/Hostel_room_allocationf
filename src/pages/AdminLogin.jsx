import { useState, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import useFormValidation from '../hooks/useFormValidation';
import Toast from '../components/Toast';
import { Shield, Lock, ArrowRight, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminLogin = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const validate = useCallback((values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Enter a valid admin email';
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

            if (data.role !== 'warden' && data.role !== 'admin') {
                throw new Error('Not authorized as an administrator');
            }

            login(data, data.token);
            
            if (data.isFirstLogin) {
                setShowWelcome(true);
                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 2000);
            } else {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setAuthError(err.response?.data?.message || err.message || 'Failed to login as admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

            <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700 z-10">
                <div className="p-10 text-center border-b border-slate-700">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
                    <p className="text-slate-400 text-sm">Restricted Access</p>
                </div>

                <div className="p-8">
                    {authError && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 text-center flex items-center justify-center gap-2">
                            <AlertCircle size={18} />
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Admin Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield size={16} className={`${touched.email ? (errors.email ? 'text-red-400' : 'text-emerald-500') : 'text-slate-500'}`} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl transition-all outline-none bg-slate-700/30 text-white placeholder-slate-500 ${
                                        touched.email 
                                            ? (errors.email 
                                                ? 'border-red-500/50 focus:ring-red-500' 
                                                : 'border-emerald-500/50 focus:ring-emerald-500')
                                            : 'border-slate-600 focus:ring-red-500'
                                    }`}
                                    placeholder="admin@hostelhub.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.email && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {errors.email ? (
                                            <AlertCircle size={18} className="text-red-500" />
                                        ) : (
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.email && errors.email && (
                                <p className="mt-1 text-[11px] text-red-400 font-medium ml-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Passcode</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={16} className={`${touched.password ? (errors.password ? 'text-red-400' : 'text-emerald-500') : 'text-slate-500'}`} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl transition-all outline-none bg-slate-700/30 text-white placeholder-slate-500 ${
                                        touched.password 
                                            ? (errors.password 
                                                ? 'border-red-500/50 focus:ring-red-500' 
                                                : 'border-emerald-500/50 focus:ring-emerald-500')
                                            : 'border-slate-600 focus:ring-red-500'
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
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1 text-[11px] text-red-400 font-medium ml-1 leading-relaxed">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isValid}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-500/25 mt-8 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
                        >
                            {loading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Authenticate <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link to="/login" className="text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1">
                            <ArrowRight size={14} className="rotate-180" /> Return to Student Portal
                        </Link>
                    </div>
                </div>
            </div>
            <Toast 
                isVisible={showWelcome} 
                message="Welcome back, Administrator! Your secure session has started." 
                onClose={() => setShowWelcome(false)}
            />
        </div>
    );
};

export default AdminLogin;
