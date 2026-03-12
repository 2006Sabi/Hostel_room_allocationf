import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, BookOpen, Calendar, LogOut, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
    const { user, logout, login } = useContext(AuthContext); // Need login/setUser method to update context if changed. Actually context will automatically refetch if we update localStorage, but wait auth context has a bug if not refetched. Let's just use window.location.reload() on success to keep it simple and robust.
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Safety check - we initialize state with user details if available
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        year: user?.year || '',
        CGPA: user?.CGPA || '',
        distance: user?.distance || '',
        registerNumber: user?.registerNumber || ''
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.put('/auth/profile', formData);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            // Updating localstorage so context picks it up after reload
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.reload(); // Quick refresh to update global context state
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 max-w-xl mx-auto text-center transform hover:scale-[1.01] transition-transform">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                        <span className="text-4xl font-black">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                    <p className="text-gray-500 mb-6 flex items-center justify-center gap-2">
                        <ShieldCheck size={16} className="text-green-500" />
                        Verified {user.role === 'admin' ? 'Administrator' : 'Student'} Profile
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100 mb-8">
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-4">{error}</div>}
                        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium mb-4">{success}</div>}

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Mail size={20} /></div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!isEditing} className="w-full bg-transparent font-semibold text-gray-800 outline-none border-b border-transparent focus:border-blue-500 transition-colors disabled:opacity-70" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                                <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><User size={20} /></div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} className="w-full bg-transparent font-semibold text-gray-800 outline-none border-b border-transparent focus:border-blue-500 transition-colors disabled:opacity-70" />
                                </div>
                            </div>

                            {user.role !== 'admin' && (
                                <>
                                    <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                                        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><BookOpen size={20} /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Department</label>
                                            <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} disabled={!isEditing} className="w-full bg-transparent font-semibold text-gray-800 outline-none border-b border-transparent focus:border-indigo-500 transition-colors disabled:opacity-70" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><LogOut size={20} /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Register Number</label>
                                            <input type="text" value={formData.registerNumber} onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })} disabled={!isEditing} className="w-full bg-transparent font-semibold text-gray-800 outline-none border-b border-transparent focus:border-purple-500 transition-colors disabled:opacity-70" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                                        <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Calendar size={20} /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Year of Study</label>
                                            <input type="number" min="1" max="5" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} disabled={!isEditing} className="w-full bg-transparent font-semibold text-gray-800 outline-none border-b border-transparent focus:border-orange-500 transition-colors disabled:opacity-70" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                                        <div className="bg-green-100 p-3 rounded-xl text-green-600"><ShieldCheck size={20} /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">CGPA</label>
                                            <input type="number" step="0.01" min="0" max="10" value={formData.CGPA} onChange={(e) => setFormData({ ...formData, CGPA: e.target.value })} disabled={!isEditing} className="w-full bg-transparent font-semibold text-gray-800 outline-none border-b border-transparent focus:border-green-500 transition-colors disabled:opacity-70" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                                        <div className="bg-red-100 p-3 rounded-xl text-red-600"><LogOut size={20} /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Distance (km)</label>
                                            <input type="number" min="0" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} disabled={!isEditing} className="w-full bg-transparent font-semibold text-gray-800 outline-none border-b border-transparent focus:border-red-500 transition-colors disabled:opacity-70" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {isEditing && (
                                <button type="submit" disabled={isUpdating} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition flex justify-center items-center">
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            )}
                        </form>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all mb-3"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({
                                    name: user.name || '',
                                    email: user.email || '',
                                    department: user.department || '',
                                    year: user.year || '',
                                    CGPA: user.CGPA || '',
                                    distance: user.distance || '',
                                    registerNumber: user.registerNumber || ''
                                });
                                setError('');
                                setSuccess('');
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all mb-3"
                        >
                            Cancel Editing
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 px-6 rounded-xl transition-all"
                    >
                        <LogOut size={20} /> Secure Logout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Profile;
