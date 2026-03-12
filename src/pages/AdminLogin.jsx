import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Shield, Lock, ArrowRight, Loader } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (data.role !== 'warden' && data.role !== 'admin') {
                throw new Error('Not authorized as an administrator');
            }

            login(data, data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login as admin');
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
                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Admin Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Shield size={16} className="text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl focus:ring-red-500 focus:border-red-500 bg-slate-700/50 text-white placeholder-slate-500 transition-colors outline-none"
                                    placeholder="admin@hostelhub.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Passcode</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={16} className="text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-xl focus:ring-red-500 focus:border-red-500 bg-slate-700/50 text-white placeholder-slate-500 transition-colors outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-500/25 mt-8 disabled:opacity-70"
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
        </div>
    );
};

export default AdminLogin;
