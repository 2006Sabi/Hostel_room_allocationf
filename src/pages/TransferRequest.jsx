import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Repeat, Building, AlertCircle, CheckCircle } from 'lucide-react';

const TransferRequest = () => {
    const [currentRoom, setCurrentRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [requestedRoomId, setRequestedRoomId] = useState('');
    const [reason, setReason] = useState('');

    // UI state
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Check application status for current room
            try {
                const { data: statusData } = await api.get('/student/status');
                if (statusData && statusData.status === 'Approved') {
                    setCurrentRoom(statusData.roomId);
                }
            } catch (err) {
                if (err.response?.status !== 404) throw err;
            }

            // Fetch available rooms
            const { data: roomData } = await api.get('/student/rooms');
            setRooms(roomData);
        } catch (err) {
            setError('Failed to load required data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!requestedRoomId) {
            setError('Please select a requested room block.');
            return;
        }

        if (!reason || reason.trim() === '') {
            setError('Reason for transfer is mandatory.');
            return;
        }

        setSubmitting(true);

        try {
            const currentRoomForPayload = typeof currentRoom === 'string'
                ? currentRoom
                : typeof currentRoom === 'object' && currentRoom !== null
                    ? currentRoom._id || currentRoom.roomId // Account for varying structures
                    : currentRoom;

            await api.post('/transfers', {
                currentRoom: currentRoomForPayload,
                requestedRoomId,
                reason
            });
            setSuccess('Transfer request submitted successfully. Waiting for admin approval.');
            setRequestedRoomId('');
            setReason('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit transfer request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Repeat size={36} className="text-purple-600" />
                        Room Transfer Request
                    </h1>
                    <p className="text-gray-500 mt-2">Request to change your currently allocated room to a different block.</p>
                </div>

                {!currentRoom ? (
                    <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
                        <Building className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Transfer Not Available</h3>
                        <p className="text-gray-500 mb-6">You must have an approved room allocation before requesting a transfer.</p>
                        <button onClick={() => navigate('/student/apply')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors font-semibold">
                            Apply for a Room First
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-8">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-medium mb-6">
                                    <AlertCircle size={20} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2 font-medium mb-6">
                                    <CheckCircle size={20} />
                                    {success}
                                </div>
                            )}

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 flex items-center justify-between">
                                <div>
                                    <span className="text-xs uppercase tracking-wider font-bold text-gray-500">Current Room Block</span>
                                    <h3 className="text-2xl font-black text-gray-900 mt-1">{currentRoom.block}</h3>
                                </div>
                                <Building size={40} className="text-gray-300" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Requested Block</label>
                                    <select
                                        value={requestedRoomId}
                                        onChange={(e) => setRequestedRoomId(e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
                                        required
                                    >
                                        <option value="">-- Choose a block --</option>
                                        {rooms.map(room => (
                                            <option key={room._id} value={room._id} disabled={room._id === currentRoom._id}>
                                                {room.block} {room._id === currentRoom._id ? '(Current)' : ''} - (Total: {room.totalRooms}, Available: {room.totalRooms - room.occupiedRooms})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Transfer</label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors"
                                        rows="4"
                                        placeholder="Briefly explain why you want to transfer..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center shadow-md ${submitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'
                                        }`}
                                >
                                    {submitting ? 'Submitting Request...' : 'Submit Transfer Request'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferRequest;
