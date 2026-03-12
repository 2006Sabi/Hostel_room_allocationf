import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Users,
    Home,
    ClipboardList,
    RefreshCw,
    TrendingUp,
    ChevronRight,
    AlertCircle,
    LayoutDashboard,
    ArrowUpRight,
    CheckCircle,
    Clock,
    UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        pendingApplications: 0,
        pendingTransfers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allocating, setAllocating] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (err) {
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, link, description }) => (
        <Link to={link || "#"} className="group">
            <div className={`bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-full`}>
                <div className={`absolute -top-10 -right-10 w-32 h-32 ${color.bg} rounded-full blur-3xl opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`w-14 h-14 ${color.bg} ${color.text} rounded-2xl flex items-center justify-center shadow-lg shadow-gray-50 group-hover:rotate-12 transition-transform`}>
                        <Icon size={28} />
                    </div>
                    <ArrowUpRight className="text-gray-300 group-hover:text-red-500 transition-colors" size={20} />
                </div>

                <div className="space-y-1 relative z-10">
                    <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase">{value}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-2">{description}</p>
                </div>
            </div>
        </Link>
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                <span className="text-gray-500 font-black uppercase tracking-widest text-xs">Initializing Dashboard...</span>
            </div>
        </div>
    );

    const handleAutoAllocate = async () => {
        if (!window.confirm("Are you sure you want to run the automatic room allocation algorithm? This will assign rooms to all pending applications based on priority.")) {
            return;
        }

        setAllocating(true);
        setError('');
        try {
            const { data } = await api.post('/admin/allocate-all');
            alert(`Allocation Complete!\n\nProcessed: ${data.processed}\nAllocated: ${data.allocated}\nRemain Pending: ${data.remainedPending}\n\nMessage: ${data.message}`);
            fetchStats(); // refresh dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to trigger allocation');
        } finally {
            setAllocating(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Greeting & Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Warden Overview</h1>
                    </div>
                    <p className="text-gray-500 font-medium ml-5">Comprehensive analytics of the hostel infrastructure and student body.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 border border-gray-100 rounded-2xl shadow-sm">
                    <button onClick={fetchStats} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <RefreshCw size={20} />
                    </button>
                    <div className="h-4 w-px bg-gray-100"></div>
                    <span className="px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Live System Status</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-bold">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Auto Allocate Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleAutoAllocate}
                    disabled={allocating || stats.pendingApplications === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-red-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {allocating ? <RefreshCw className="animate-spin" size={24} /> : <TrendingUp size={24} />}
                    {allocating ? 'Processing Allocation...' : 'Run Auto-Allocation Algorithm'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCard
                    title="Resident Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color={{ bg: 'bg-red-50', text: 'text-red-600' }}
                    link="/admin/students"
                    description="Total number of students registered on the platform across all wings."
                />
                <StatCard
                    title="Room Capacity"
                    value={stats.totalRooms}
                    icon={Home}
                    color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                    link="/admin/rooms"
                    description="Total rooms available in different blocks including Single/Double occupancy."
                />
                <StatCard
                    title="Occupancy Rate"
                    value={`${Math.round((stats.occupiedRooms / stats.totalRooms) * 100) || 0}%`}
                    icon={TrendingUp}
                    color={{ bg: 'bg-purple-50', text: 'text-purple-600' }}
                    link="/admin/rooms"
                    description="Percentage of rooms currently assigned to students vs total capacity."
                />
                <StatCard
                    title="Pending Applications"
                    value={stats.pendingApplications}
                    icon={ClipboardList}
                    color={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
                    link="/admin/applications"
                    description="New applications submitted by students awaiting warden review."
                />
                <StatCard
                    title="Transfer Requests"
                    value={stats.pendingTransfers}
                    icon={RefreshCw}
                    color={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }}
                    link="/admin/transfers"
                    description="Pending requests for internal room changes between different blocks."
                />
                <StatCard
                    title="Available Slots"
                    value={stats.availableRooms}
                    icon={UserPlus}
                    color={{ bg: 'bg-green-50', text: 'text-green-600' }}
                    link="/admin/rooms"
                    description="Number of rooms that have at least one vacant spot for allocation."
                />
            </div>

            {/* Quick Actions & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <LayoutDashboard className="text-red-600" size={20} />
                        Administrative Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/admin/applications" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-red-600 group rounded-3xl transition-all">
                            <span className="font-bold text-gray-900 group-hover:text-white transition-colors">Approve New Apps</span>
                            <ChevronRight className="text-gray-400 group-hover:text-white" size={18} />
                        </Link>
                        <Link to="/admin/transfers" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-red-600 group rounded-3xl transition-all">
                            <span className="font-bold text-gray-900 group-hover:text-white transition-colors">Manage Transfers</span>
                            <ChevronRight className="text-gray-400 group-hover:text-white" size={18} />
                        </Link>
                        <Link to="/admin/reports" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-black group rounded-3xl transition-all">
                            <span className="font-bold text-gray-900 group-hover:text-white transition-colors">Generate Reports</span>
                            <ChevronRight className="text-gray-400 group-hover:text-white" size={18} />
                        </Link>
                        <Link to="/admin/settings" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-black group rounded-3xl transition-all">
                            <span className="font-bold text-gray-900 group-hover:text-white transition-colors">Allocation Rules</span>
                            <ChevronRight className="text-gray-400 group-hover:text-white" size={18} />
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                            <CheckCircle className="text-red-500" size={20} />
                            System Health
                        </h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-slate-400" size={16} />
                                    <span className="text-sm font-medium text-slate-300">Last Sync</span>
                                </div>
                                <span className="text-sm font-black uppercase text-green-400 tracking-widest">Just Now</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="text-slate-400" size={16} />
                                    <span className="text-sm font-medium text-slate-300">Allocation Logic</span>
                                </div>
                                <span className="text-sm font-black uppercase text-blue-400 tracking-widest">v2.0 Priority</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Authenticated As</p>
                        <p className="text-lg font-black tracking-tight text-white">Chief Hostel Warden</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
