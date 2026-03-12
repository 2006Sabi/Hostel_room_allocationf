import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Bell,
    Send,
    Trash2,
    User,
    Users,
    AlertCircle,
    CheckCircle2,
    Clock,
    Search,
    X,
    MessageSquare,
    Megaphone
} from 'lucide-react';

const NotificationManagement = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form states
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('All');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Assuming there's an endpoint to get sent notifications
            const { data } = await api.get('/admin/notifications');
            setNotifications(data);
        } catch (err) {
            // If endpoint doesn't exist yet, we'll just show empty
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await api.post('/admin/notifications', { title, message, target });
            setNotifications([data, ...notifications]);
            setSuccess('Notification sent successfully!');
            setTitle('');
            setMessage('');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            setError('Failed to delete notification');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* Notification Form */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                            <Megaphone size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Push Notice</h2>
                            <p className="text-gray-400 text-sm font-medium">Send alerts to students.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSend} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Target Audience</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['All', '1st Year', '2nd Year', 'Finals'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setTarget(type)}
                                        className={`py-3 rounded-2xl text-xs font-black transition-all border ${target === type
                                            ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100'
                                            : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Notice Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                placeholder="e.g. Room Allocation Started"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Message Body</label>
                            <textarea
                                required
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900 resize-none"
                                placeholder="Write your announcement here..."
                            ></textarea>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 size={14} /> {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {sending ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <Send size={20} />}
                            {sending ? 'Sending...' : 'Broadcast Message'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Notification History */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Sent Announcements</h2>
                        <p className="text-gray-500 text-sm">History of broadcasts sent to students.</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <Bell size={20} />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Sent Notices</h3>
                        <p className="text-gray-500 text-sm">You haven't sent any announcements yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div key={n._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-red-100 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${n.target === 'All' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                            }`}>
                                            To: {n.target}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            <Clock size={12} />
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(n._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">{n.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{n.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationManagement;
