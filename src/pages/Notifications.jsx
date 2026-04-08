import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bell, Clock, MessageSquare } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/student/notifications');
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Announcements</h1>
                <p className="text-gray-500 mt-2 font-medium">Stay updated with the latest hostel notices and alerts.</p>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[500px]">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Recent Notices</h2>
                            <p className="text-sm text-gray-500">Important updates from your warden</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold text-gray-600">
                        {loading ? '...' : notifications.length} {notifications.length === 1 ? 'Notice' : 'Notices'}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center">
                            <MessageSquare size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">No new notifications yet</h3>
                            <p className="text-gray-500 mt-1">We'll let you know when there's an announcement for you.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div key={n._id} className="p-6 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-lg transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {n.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                        <Clock size={14} />
                                        {(() => {
                                            const date = new Date(n.createdAt);
                                            const now = new Date();
                                            const diff = now - date;
                                            const mins = Math.floor(diff / 60000);
                                            const hours = Math.floor(mins / 60);
                                            const days = Math.floor(hours / 24);

                                            if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`;
                                            if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                                            if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
                                            
                                            return date.toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            });
                                        })()}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {n.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
