import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Clock, CheckCircle, XCircle, FileText, AlertCircle, Building, Trash2 } from 'lucide-react';

const ApplicationStatus = () => {
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStatus = async () => {
        try {
            const { data } = await api.get('/student/status');
            setApplication(data);
        } catch (err) {
            if (err.response?.status !== 404) {
                setError('Failed to fetch status');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your application?')) return;

        try {
            await api.delete(`/student/cancel/${application._id}`);
            setApplication(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel application');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-600 p-4 rounded-full">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
                        <p className="text-gray-500 mt-1">Track the progress of your hostel application.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 font-medium border border-red-100">
                        <AlertCircle size={24} />
                        {error}
                    </div>
                )}

                {application ? (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-2 h-full ${application.status === 'Approved' ? 'bg-green-500' :
                            application.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-400'
                            }`}></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pl-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${application.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                    application.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                        'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {application.status === 'Approved' && <CheckCircle size={36} />}
                                    {application.status === 'Rejected' && <XCircle size={36} />}
                                    {application.status === 'Pending' && <Clock size={36} />}
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Current Status</h2>
                                    <h3 className={`text-3xl font-black ${application.status === 'Approved' ? 'text-green-600' :
                                        application.status === 'Rejected' ? 'text-red-600' :
                                            'text-yellow-600'
                                        }`}>
                                        {application.status}
                                    </h3>
                                </div>
                            </div>

                            <div className="text-right w-full md:w-auto">
                                <p className="text-sm text-gray-400 font-semibold mb-1">Applied Date</p>
                                <p className="font-bold text-gray-800 text-lg">{new Date(application.appliedDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 pl-8 mb-8">
                            <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Allocation Details</h4>
                            <div className="flex justify-between items-center text-sm md:text-base">
                                <span className="text-gray-500 font-semibold">Allocated Block</span>
                                <span className="font-bold text-indigo-600 text-xl flex items-center gap-2">
                                    <Building size={20} /> Block {application.roomId?.block || application.preferences?.block}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm md:text-base border-t border-gray-100 pt-3">
                                <span className="text-gray-500 font-semibold">Room Type</span>
                                <span className="font-bold text-gray-800">{application.preferences?.type}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm md:text-base border-t border-gray-100 pt-3">
                                <span className="text-gray-500 font-semibold">Sharing Preference</span>
                                <span className="font-bold text-gray-800">{application.preferences?.sharing}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm md:text-base border-t border-gray-100 pt-3">
                                <span className="text-gray-500 font-semibold">Special Category</span>
                                <span className="font-bold text-gray-800">{application.specialCategory || 'None'}</span>
                            </div>
                            {application.roomId?.roomNumber && (
                                <div className="flex justify-between items-center text-sm md:text-base border-t border-gray-100 pt-3">
                                    <span className="text-gray-500 font-semibold">Allocated Room No.</span>
                                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                        {application.roomId.roomNumber}
                                    </span>
                                </div>
                            )}
                        </div>

                        {application.status === 'Pending' && (
                            <div className="pl-4">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl font-bold transition-all"
                                >
                                    <Trash2 size={20} /> Cancel Application
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Application</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">You have not applied for any hostel room yet. Click below to browse available rooms and apply.</p>

                        <a
                            href="/student/apply"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/30"
                        >
                            Start Application
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationStatus;
