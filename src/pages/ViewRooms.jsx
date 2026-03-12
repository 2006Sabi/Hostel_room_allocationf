import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Building, AlertCircle } from 'lucide-react';

const ViewRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await api.get('/student/rooms');
                setRooms(data);
            } catch (err) {
                setError('Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Building className="text-blue-600" /> Room Availability
                    </h1>
                    <p className="text-gray-500 mt-2">Check real-time occupancy and available capacity across all blocks.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-medium mb-8">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-gray-900">Block {room.block}</h3>
                                <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider">
                                    Available
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total</span>
                                    <span className="text-xl font-bold text-gray-900">{room.totalRooms}</span>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                    <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Occupied</span>
                                    <span className="text-xl font-bold text-gray-900">{room.occupiedRooms}</span>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-4 flex justify-between items-center border border-blue-100">
                                    <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Available</span>
                                    <span className="text-2xl font-black text-blue-700">{room.totalRooms - room.occupiedRooms}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full rounded-full"
                                        style={{ width: `${(room.occupiedRooms / room.totalRooms) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-xs text-gray-400 mt-2 font-medium">
                                    {Math.round((room.occupiedRooms / room.totalRooms) * 100)}% Filled
                                </p>
                            </div>
                        </div>
                    ))}
                    {rooms.length === 0 && !error && (
                        <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
                            <Building className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-gray-700">No Availability</h3>
                            <p className="text-gray-500 mt-2">All rooms are currently full or unavailable.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ViewRooms;
