import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    User,
    Mail,
    Shield,
    Key,
    Save,
    AlertCircle,
    CheckCircle2,
    Loader2,
    LogOut,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/auth/profile');
            setUser(data);
            setFormData({
                name: data.name,
                email: data.email,
                password: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccess('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setUpdating(false);
            return;
        }

        try {
            const updateData = {
                name: formData.name,
                email: formData.email
            };
            if (formData.password) updateData.password = formData.password;

            const { data } = await api.put('/auth/profile', updateData);
            setUser(data);
            setSuccess('Profile updated successfully!');
            setFormData({ ...formData, password: '', confirmPassword: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-red-500" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">{user?.role} Account</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Account Settings */}
                <div className="md:col-span-2">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <Shield className="text-red-500" size={20} />
                            <h2 className="text-xl font-black text-gray-900">Security Settings</h2>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-red-50/30 rounded-3xl border border-red-50 space-y-6">
                                <p className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-4">Change Password</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <Key size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Leave blank to keep same"
                                                className="w-full pl-11 pr-12 py-4 bg-white border border-transparent rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                                <Key size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full pl-11 pr-4 py-4 bg-white border border-transparent rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-medium">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 text-green-600 p-4 rounded-2xl border border-green-100 flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 size={18} />
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {updating ? 'Updating...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Profile Stats */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl overflow-hidden relative group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
                        <h3 className="text-lg font-black mb-6 relative z-10 uppercase tracking-wider">Access Info</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Shield size={18} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</p>
                                    <p className="text-sm font-bold text-white uppercase">{user?.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Key size={18} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account ID</p>
                                    <p className="text-[10px] font-mono text-slate-400 truncate w-32">{user?._id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
