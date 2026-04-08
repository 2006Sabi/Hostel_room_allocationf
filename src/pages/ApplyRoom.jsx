import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Send, Building, AlertCircle, ArrowRight, CheckCircle, Loader } from 'lucide-react';

const ApplyRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [application, setApplication] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedType, setSelectedType] = useState('Any');
    const [selectedSharing, setSelectedSharing] = useState('Any');
    const [specialCategory, setSpecialCategory] = useState('None');
    const [city, setCity] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Check if already applied
            try {
                const { data: appData } = await api.get('/student/status');
                setApplication(appData);
                if (appData) {
                    setError('You have already applied for a room.');
                }
            } catch (err) {
                if (err.response?.status !== 404) {
                    throw err;
                }
            }

            // Fetch available rooms
            const { data: roomData } = await api.get('/student/rooms');
            setRooms(roomData);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRoom) {
            return setError('Please select a block to apply');
        }

        setSubmitLoading(true);
        setError('');
        try {
            await api.post('/student/apply', {
                roomId: selectedRoom,
                type: selectedType,
                sharing: selectedSharing,
                specialCategory: specialCategory,
                city: city,
                message: requestMessage // Not in backend schema but added to request per requirement
            });
            setSuccess('Application submitted successfully!');
            setTimeout(() => navigate('/student/status'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-50">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6 md:p-12">
            <div className="max-w-2xl mx-auto space-y-8">

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Room Application</h1>
                    <p className="text-gray-500 mt-2">Submit your request for hostel accommodation.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 font-medium border border-red-100">
                        <AlertCircle size={24} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-3 font-medium border border-green-100 mb-6">
                        <CheckCircle size={24} />
                        {success}
                    </div>
                )}

                {!application && !success && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Select Preferred Block</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building size={18} className="text-gray-400" />
                                    </div>
                                    <select
                                        required
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all outline-none appearance-none font-medium text-gray-800 cursor-pointer"
                                    >
                                        <option value="" disabled>Choose a block...</option>
                                        {rooms.map(room => (
                                            <option key={room._id} value={room._id}>
                                                Block {room.block} ({room.totalRooms - room.occupiedRooms} availability left)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {rooms.length === 0 && (
                                    <p className="text-xs text-red-500 mt-2">No rooms currently available to apply.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">City / Hometown</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="E.g. Madurai"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all outline-none font-medium text-gray-800"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Distance will be automatically calculated for group allocation.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Room Type</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all outline-none font-medium text-gray-800 cursor-pointer"
                                    >
                                        <option value="Any">Any</option>
                                        <option value="Single">Single Room</option>
                                        <option value="Double">Double Sharing</option>
                                        <option value="Triple">Triple Sharing</option>
                                        <option value="Dormitory">Dormitory</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Sharing Preference</label>
                                    <select
                                        value={selectedSharing}
                                        onChange={(e) => setSelectedSharing(e.target.value)}
                                        className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all outline-none font-medium text-gray-800 cursor-pointer"
                                    >
                                        <option value="Any">Any</option>
                                        <option value="AC">AC</option>
                                        <option value="Non-AC">Non-AC</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Special Category (Priority Allocation)</label>
                                <select
                                    value={specialCategory}
                                    onChange={(e) => setSpecialCategory(e.target.value)}
                                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all outline-none font-medium text-gray-800 cursor-pointer"
                                >
                                    <option value="None">None (Standard Applying)</option>
                                    <option value="Physically Challenged">Physically Challenged</option>
                                    <option value="Sports Quota">Sports Quota</option>
                                    <option value="Other">Other Special Needs</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                                    Special Request <span className="text-gray-400 text-xs font-normal lowercase">(Optional)</span>
                                </label>
                                <textarea
                                    className="block w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all outline-none text-gray-800 resize-none h-32"
                                    placeholder="Any specific requirements or notes..."
                                    value={requestMessage}
                                    onChange={(e) => setRequestMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading || rooms.length === 0}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 mt-8"
                            >
                                {submitLoading ? (
                                    <Loader className="animate-spin" size={24} />
                                ) : (
                                    <>Submit Application <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {application && !success && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Already Applied</h3>
                        <p className="text-gray-500 mb-6">You have an active application. You cannot submit multiple applications simultaneously.</p>

                        <button
                            onClick={() => navigate('/student/status')}
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            View Status Instead
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ApplyRoom;
