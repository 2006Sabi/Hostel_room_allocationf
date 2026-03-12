import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Plus,
    Edit2,
    Trash2,
    Home,
    Users,
    Layout,
    AlertCircle,
    X,
    Info,
    CheckCircle2,
    Building
} from 'lucide-react';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomToDelete, setRoomToDelete] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        roomNumber: '',
        block: '',
        type: 'Double',
        capacity: 2
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            // Using existing general rooms route but we might need all rooms including occupied
            const { data } = await api.get('/rooms');
            setRooms(data);
        } catch (err) {
            setError('Failed to fetch rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'capacity' ? parseInt(value) : value
        });
    };

    const handleOpenAddModal = () => {
        setEditingRoom(null);
        setFormData({
            roomNumber: '',
            block: '',
            type: 'Double',
            capacity: 2
        });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (room) => {
        setEditingRoom(room);
        setFormData({
            roomNumber: room.roomNumber,
            block: room.block,
            type: room.type,
            capacity: room.capacity
        });
        setShowAddModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoom) {
                const { data } = await api.put(`/rooms/${editingRoom._id}`, formData);
                setRooms(rooms.map(r => r._id === editingRoom._id ? data : r));
            } else {
                const { data } = await api.post('/rooms', formData);
                setRooms([...rooms, data]);
            }
            setShowAddModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDeleteClick = (room) => {
        setRoomToDelete(room);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/rooms/${roomToDelete._id}`);
            setRooms(rooms.filter(r => r._id !== roomToDelete._id));
            setShowDeleteModal(false);
            setRoomToDelete(null);
        } catch (err) {
            setError('Failed to delete room');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
                    <p className="text-gray-500 text-sm">Create, update and manage hostel room blocks and availability.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-100 active:scale-95"
                >
                    <Plus size={20} />
                    Add New Room
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center justify-between gap-3 text-sm font-medium">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                    <button onClick={() => setError('')}><X size={18} /></button>
                </div>
            )}

            {/* Room Cards Grid */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div>
                        <span className="text-gray-500 font-medium tracking-wide">Loading rooms...</span>
                    </div>
                </div>
            ) : rooms.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto">
                            <Home size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Rooms Yet</h3>
                        <p className="text-gray-500 text-sm">Start by adding your first room block to the system.</p>
                        <button
                            onClick={handleOpenAddModal}
                            className="text-red-600 font-bold text-sm bg-red-50 px-6 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            Add New Room
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map((room) => (
                        <div key={room._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-red-500">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors rounded-2xl flex items-center justify-center">
                                        <Home size={24} />
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleOpenEditModal(room)}
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(room)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="text-xl font-black text-gray-900">Room {room.roomNumber}</h3>
                                    <p className="text-sm font-bold text-red-600 uppercase tracking-widest">{room.block} Block</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-medium">Type</span>
                                        <span className="text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-lg">{room.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-medium">Capacity</span>
                                        <span className="text-gray-900 font-bold">{room.capacity} Students</span>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex justify-between items-center mb-1.5 text-xs font-bold uppercase tracking-wider">
                                            <span className="text-gray-400">Occupancy</span>
                                            <span className={room.occupied >= room.capacity ? 'text-red-600' : 'text-green-600'}>
                                                {room.occupied}/{room.capacity}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${room.occupied >= room.capacity ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSubmit}>
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                                            {editingRoom ? <Edit2 size={24} /> : <Plus size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                                            <p className="text-gray-400 text-sm font-medium">Register room details on system.</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5 col-span-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Room Number</label>
                                        <input
                                            type="text"
                                            name="roomNumber"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                            placeholder="e.g. 101"
                                            value={formData.roomNumber}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Block Name</label>
                                        <input
                                            type="text"
                                            name="block"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                            placeholder="e.g. A"
                                            value={formData.block}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-1.5 col-span-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Room Type</label>
                                        <select
                                            name="type"
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900 appearance-none"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Single">Single</option>
                                            <option value="Double">Double</option>
                                            <option value="Triple">Triple</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 col-span-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
                                        <input
                                            type="number"
                                            name="capacity"
                                            required
                                            min="1"
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                                            value={formData.capacity}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
                                >
                                    {editingRoom ? 'Update Room' : 'Save Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-red-50 text-red-600 rounded-3xl">
                                    <Trash2 size={32} />
                                </div>
                                <button onClick={() => setShowDeleteModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Room?</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Are you sure you want to delete <span className="font-bold text-gray-900">Room {roomToDelete?.roomNumber} ({roomToDelete?.block} Block)</span>?
                                This cannot be undone.
                            </p>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomManagement;
