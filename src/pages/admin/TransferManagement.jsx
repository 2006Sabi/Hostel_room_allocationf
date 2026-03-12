import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    RefreshCcw,
    ArrowRight,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Home,
    AlertCircle,
    Building2,
    Calendar,
    ChevronRight,
    MapPin
} from 'lucide-react';

const TransferManagement = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/transfers');
            setTransfers(data);
        } catch (err) {
            setError('Failed to fetch transfer requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (id, decision) => {
        try {
            await api.put(`/transfers/${id}/approve`, { decision });
            fetchTransfers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process transfer');
        }
    };

    const filteredTransfers = activeFilter === 'All'
        ? transfers
        : transfers.filter(t => t.status === activeFilter);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-50 text-green-700 border-green-100 ring-4 ring-green-100/30';
            case 'Rejected': return 'bg-red-50 text-red-700 border-red-100 ring-4 ring-red-100/30';
            default: return 'bg-orange-50 text-orange-700 border-orange-100 ring-4 ring-orange-100/30';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transfer Management</h1>
                    <p className="text-gray-500 text-sm">Review and manage room transfer requests from students.</p>
                </div>
                <div className="flex p-1 bg-gray-50 rounded-2xl w-fit">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === filter
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Transfer Requests List */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div>
                        <span className="text-gray-500 font-medium">Loading transfer requests...</span>
                    </div>
                </div>
            ) : filteredTransfers.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto">
                            <RefreshCcw size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Transfers Found</h3>
                        <p className="text-gray-500 text-sm">There are currently no room transfer requests to display.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredTransfers.map((req) => (
                        <div key={req._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:border-red-100 transition-all">
                            <div className="p-6 md:p-10">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                                    {/* Student Card */}
                                    <div className="flex items-center gap-5 min-w-[280px]">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 group-hover:from-red-50 group-hover:to-red-100 group-hover:text-red-600 rounded-3xl flex items-center justify-center transition-all shadow-inner text-2xl font-black">
                                            {req.studentId?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900">{req.studentId?.name}</h3>
                                            <p className="text-sm text-gray-400 font-bold mb-1">{req.studentId?.email}</p>
                                            <span className="bg-gray-50 text-gray-600 px-3 py-0.5 rounded-lg text-xs font-bold border border-gray-100">
                                                Year {req.studentId?.year}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Transfer Details Card */}
                                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
                                        <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-0.5">Current Room</p>
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-3">
                                                    <Home size={28} className="text-gray-300" />
                                                </div>
                                                <span className="text-lg font-black text-gray-900">Room {req.currentRoom?.roomNumber || 'N/A'}</span>
                                                <span className="text-xs font-bold text-red-500 tracking-wider">BLOCK {req.currentRoom?.block || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center animate-pulse">
                                                <ArrowRight className="text-red-500" size={24} />
                                            </div>
                                            <span className="mt-3 text-[10px] font-black text-red-400 uppercase tracking-widest">RELOCATING</span>
                                        </div>

                                        <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-0.5">Requested Room</p>
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-orange-100 flex items-center justify-center mb-3">
                                                    <Building2 size={28} className="text-orange-400" />
                                                </div>
                                                <span className="text-lg font-black text-gray-900">Room {req.requestedRoom?.roomNumber || 'N/A'}</span>
                                                <span className="text-xs font-bold text-orange-500 tracking-wider">BLOCK {req.requestedRoom?.block || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reason Card */}
                                    <div className="flex-1 min-w-[200px] bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Reason</p>
                                        <p className="text-sm text-slate-700 leading-relaxed italic">"{req.reason || 'No reason provided'}"</p>
                                    </div>

                                    {/* Actions Card */}
                                    <div className="flex flex-col gap-3 min-w-[200px]">
                                        <div className="text-center mb-1">
                                            <span className={`inline-block px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-transparent ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        {req.status === 'Pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleDecision(req._id, 'Approved')}
                                                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl font-black shadow-lg shadow-red-100 transition-all active:scale-95"
                                                >
                                                    <CheckCircle size={20} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(req._id, 'Rejected')}
                                                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-4 rounded-2xl font-black transition-all active:scale-95"
                                                >
                                                    <XCircle size={20} /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                                                <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-widest">Processed On</span>
                                                <span className="text-sm font-black text-gray-900">{new Date(req.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransferManagement;
