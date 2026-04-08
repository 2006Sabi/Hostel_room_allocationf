import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Search,
    User,
    Building,
    Calendar,
    GraduationCap,
    Trash2,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const ApplicationManagement = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [statusFilter, setStatusFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [statusFilter, yearFilter, searchTerm, applications]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/applications');
            setApplications(data);
        } catch (err) {
            setError('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let result = applications;

        if (statusFilter !== 'All') {
            result = result.filter(app => app.status === statusFilter);
        }

        if (yearFilter !== 'All') {
            result = result.filter(app => app.studentId?.year?.toString() === yearFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(app =>
                app.studentId?.name?.toLowerCase().includes(term) ||
                app.studentId?.email?.toLowerCase().includes(term)
            );
        }

        setFilteredApps(result);
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/applications/${id}/approve`);
            fetchApplications();
        } catch (err) {
            setError(err.response?.data?.message || 'Allocation failed. Rooms might be full.');
        }
    };

    const handleReject = async (id) => {
        try {
            // Assuming there's a reject endpoint or use a general update
            await api.put(`/admin/applications/${id}/reject`); // We might need to add this to backend
            fetchApplications();
        } catch (err) {
            setError('Failed to reject application');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
                    <p className="text-gray-500 text-sm">Review student applications and manage room allocations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-2xl text-sm font-bold border border-yellow-100 flex items-center gap-2">
                        <Clock size={16} />
                        Pending: {applications.filter(a => a.status === 'Pending').length}
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search student name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <select
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <div className="relative">
                    <select
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm appearance-none"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                    >
                        <option value="All">All Years</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center justify-between gap-3 text-sm font-medium">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                    <button onClick={() => setError('')}><XCircle size={18} className="cursor-pointer" /></button>
                </div>
            )}

            {/* Applications List */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div>
                        <span className="text-gray-500 font-medium tracking-wide">Fetching applications...</span>
                    </div>
                </div>
            ) : filteredApps.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto">
                            <FileText size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Applications</h3>
                        <p className="text-gray-500 text-sm">We couldn't find any hostel applications matching your current filters.</p>
                        <button
                            onClick={() => { setStatusFilter('All'); setYearFilter('All'); setSearchTerm(''); }}
                            className="text-red-600 font-bold text-sm bg-red-50 px-6 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredApps.map((app) => (
                        <div key={app._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all border-l-8" style={{ borderColor: app.status === 'Approved' ? '#10B981' : app.status === 'Rejected' ? '#EF4444' : '#F59E0B' }}>
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl font-black">
                                            {app.studentId?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900">{app.studentId?.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium pt-0.5">
                                                <span className="flex items-center gap-1"><GraduationCap size={14} /> Year {app.studentId?.year}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="flex items-center gap-1 font-bold text-blue-600">CGPA: {app.studentId?.CGPA}</span>
                                            </div>
                                        </div>
                                        <div className={`ml-auto px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preferences</p>
                                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                <Building size={16} className="text-gray-400" />
                                                <span>{app.preferences?.block} Block • {app.preferences?.type}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Home Location</p>
                                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span>{app.city || 'Somewhere'} • {app.distance ?? app.studentId?.distance} km</span>
                                            </div>
                                        </div>
                                        {app.allocatedRoom && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-green-600">Allocated Room</p>
                                                <div className="flex items-center gap-2 text-green-700 font-black">
                                                    <CheckCircle2 size={16} />
                                                    <span>Room {app.allocatedRoom.roomNumber} ({app.allocatedRoom.block})</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {app.status === 'Pending' && (
                                    <div className="flex md:flex-col gap-3 md:w-48">
                                        <button
                                            onClick={() => handleApprove(app._id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 transition-all active:scale-95"
                                        >
                                            <CheckCircle size={20} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(app._id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 py-4 rounded-2xl font-black transition-all active:scale-95"
                                        >
                                            <XCircle size={20} /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationManagement;
