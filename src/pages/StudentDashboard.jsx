import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Building, ClipboardList, Info, AlertCircle, Repeat } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [application, setApplication] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            try {
                const { data: appData } = await api.get('/student/status');
                setApplication(appData);
            } catch (err) {
                if (err.response?.status !== 404) {
                    throw err;
                }
            }

            const { data: roomData } = await api.get('/student/rooms');
            setRooms(roomData);
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    const availableRoomsCount = rooms.length;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name} 👋</h1>
                    <p className="text-gray-500 mt-2">Manage your hostel room application from this control panel.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-medium mb-8">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Status Summary Card */}
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200 flex flex-col justify-center">
                        <h2 className="text-indigo-100 font-semibold uppercase tracking-wider text-sm mb-2">Application Status</h2>
                        {application ? (
                            <>
                                <h3 className="text-4xl font-black mb-4">{application.status}</h3>
                                <p className="text-indigo-100">For Block {application.roomId?.block}</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-4xl font-black mb-4">Not Applied</h3>
                                <p className="text-indigo-100">You haven't submitted an application yet.</p>
                            </>
                        )}
                    </div>

                    {/* Rooms Summary Card */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex items-center gap-6">
                        <div className="bg-blue-50 text-blue-600 p-6 rounded-2xl">
                            <Building size={48} />
                        </div>
                        <div>
                            <h2 className="text-gray-500 font-semibold uppercase tracking-wider text-sm mb-1">Available Blocks</h2>
                            <h3 className="text-5xl font-black text-gray-900">{availableRoomsCount}</h3>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">Quick Navigation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link
                        to="/student/apply"
                        className="group bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 hover:-translate-y-1"
                    >
                        <div className="bg-green-50 text-green-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                            <ClipboardList size={32} />
                        </div>
                        <span className="font-bold text-gray-900">Apply for a Room</span>
                    </Link>

                    <Link
                        to="/student/status"
                        className="group bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 hover:-translate-y-1"
                    >
                        <div className="bg-orange-50 text-orange-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                            <Info size={32} />
                        </div>
                        <span className="font-bold text-gray-900">View Status</span>
                    </Link>

                    <Link
                        to="/student/rooms"
                        className="group bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 hover:-translate-y-1"
                    >
                        <div className="bg-blue-50 text-blue-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                            <Building size={32} />
                        </div>
                        <span className="font-bold text-gray-900">View Rooms</span>
                    </Link>

                    <Link
                        to="/student/transfer"
                        className="group bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-4 hover:-translate-y-1"
                    >
                        <div className="bg-purple-50 text-purple-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                            <Repeat size={32} />
                        </div>
                        <span className="font-bold text-gray-900">Request Transfer</span>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;
