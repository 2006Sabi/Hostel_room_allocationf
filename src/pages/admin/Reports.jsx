import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    BarChart3,
    PieChart,
    Download,
    Calendar,
    Filter,
    FileText,
    Activity,
    Users,
    Home,
    Search,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    UserMinus
} from 'lucide-react';

const Reports = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        availableRooms: 0,
        pendingApplications: 0,
        pendingTransfers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const ProgressCircle = ({ percentage, color, label }) => {
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className={`${color} transition-all duration-1000 ease-out`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-900">{percentage}%</span>
                    </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
            </div>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="text-red-600" size={24} />
                        <h1 className="text-3xl font-black text-gray-900">Infrastructure Reports</h1>
                    </div>
                    <p className="text-gray-500 font-medium">Visualization of room occupancy and application metrics.</p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95">
                        <Download size={18} /> Export Data
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Occupancy Analytics */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Allocation Metrics</h2>
                                <p className="text-sm text-gray-400 font-medium">Distribution across different states.</p>
                            </div>
                            <div className="flex gap-8">
                                <ProgressCircle
                                    percentage={Math.round((stats.occupiedRooms / stats.totalRooms) * 100) || 0}
                                    color="text-red-500"
                                    label="Occupancy"
                                />
                                <ProgressCircle
                                    percentage={Math.round((stats.availableRooms / stats.totalRooms) * 100) || 0}
                                    color="text-green-500"
                                    label="Availability"
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-4 text-xs font-black uppercase tracking-[0.2em]">
                                    <span className="text-gray-400">Total Capacity Utilization</span>
                                    <span className="text-gray-900">{stats.occupiedRooms} / {stats.totalRooms} Rooms</span>
                                </div>
                                <div className="w-full h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-200 transition-all duration-1000 ease-out"
                                        style={{ width: `${(stats.occupiedRooms / stats.totalRooms) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:scale-105 transition-transform">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Students</p>
                                    <p className="text-2xl font-black text-gray-900">{stats.totalStudents}</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:scale-105 transition-transform">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Occupied</p>
                                    <p className="text-2xl font-black text-red-600">{stats.occupiedRooms}</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:scale-105 transition-transform">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available</p>
                                    <p className="text-2xl font-black text-green-600">{stats.availableRooms}</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:scale-105 transition-transform">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Requests</p>
                                    <p className="text-2xl font-black text-blue-600">{stats.pendingApplications + stats.pendingTransfers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Visualization Placeholder - Using CSS for premium feel */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-gray-100 group-hover:text-red-50 transition-colors">
                            <TrendingUp size={120} strokeWidth={4} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-gray-900 mb-2">Trend Analysis</h3>
                            <p className="text-gray-400 text-sm font-medium mb-12 uppercase tracking-widest">Monthly Application Volume</p>

                            <div className="flex items-end justify-between h-48 gap-4 px-4">
                                {[35, 65, 45, 85, 55, 75, 95].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4">
                                        <div
                                            className="w-full bg-red-500/10 rounded-t-2xl group-hover:bg-red-500/20 transition-all duration-1000 ease-out relative"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 rounded-full"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">M-{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="text-red-500" size={20} />
                            <h2 className="text-xl font-black uppercase tracking-tight">System Status</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <PieChart size={16} className="text-blue-400" />
                                    <span className="text-sm font-bold text-slate-300">Data Integrity</span>
                                </div>
                                <span className="text-sm font-black text-white uppercase tracking-widest">Verified</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-purple-400" />
                                    <span className="text-sm font-bold text-slate-300">Reporting Range</span>
                                </div>
                                <span className="text-sm font-black text-white uppercase tracking-widest">Current Sem</span>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-red-600 rounded-3xl relative overflow-hidden group hover:bg-black transition-all">
                            <div className="absolute -bottom-4 -right-4 text-white/10 rotate-12">
                                <BarChart3 size={90} />
                            </div>
                            <h3 className="text-lg font-black mb-1 relative z-10">Generate PDF</h3>
                            <p className="text-xs text-white/70 font-medium relative z-10">Export full audit log of all room movements.</p>
                            <button className="mt-6 w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm relative z-10 shadow-lg active:scale-95 transition-transform uppercase tracking-widest">
                                Print Report
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-red-600" /> Recent Logs
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { text: 'New Room Created', time: '2m' },
                                    { text: 'Application #204 Approved', time: '1h' },
                                    { text: 'Settings Updated', time: '5h' },
                                    { text: 'Student Data Batch Import', time: '1d' }
                                ].map((log, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:translate-x-1 transition-transform cursor-pointer group">
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-red-500 transition-colors">{log.text}</span>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
