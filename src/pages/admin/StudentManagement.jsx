import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Search, Filter, Trash2, User, Mail, Calendar, GraduationCap, MapPin, AlertCircle, X } from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('All');

    // UI State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        filterStudents();
    }, [searchTerm, yearFilter, students]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/students');
            setStudents(data);
            setFilteredStudents(data);
        } catch (err) {
            setError('Failed to fetch students. Ensure you are authorized.');
        } finally {
            setLoading(false);
        }
    };

    const filterStudents = () => {
        let result = students;

        if (searchTerm) {
            result = result.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (yearFilter !== 'All') {
            result = result.filter(s => s.year.toString() === yearFilter);
        }

        setFilteredStudents(result);
    };

    const handleDeleteClick = (student) => {
        setStudentToDelete(student);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/admin/students/${studentToDelete._id}`);
            setStudents(students.filter(s => s._id !== studentToDelete._id));
            setShowDeleteModal(false);
            setStudentToDelete(null);
        } catch (err) {
            setError('Failed to delete student');
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                    <p className="text-gray-500 text-sm">Manage student records, search, and filter by criteria.</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm font-bold">
                    <User size={18} />
                    Total Students: {students.length}
                </div>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Filter size={18} />
                    </div>
                    <select
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm appearance-none"
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
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                <th className="p-5 font-bold">Student Name</th>
                                <th className="p-5 font-bold">Academic Info</th>
                                <th className="p-5 font-bold">Location Info</th>
                                <th className="p-5 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500"></div>
                                            <span className="text-sm font-medium">Loading students...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-100 rounded-3xl p-10 max-w-sm mx-auto">
                                            <User size={48} className="text-gray-200" />
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-700">No Students Found</h3>
                                                <p className="text-gray-400 text-sm">We couldn't find any students matching your criteria.</p>
                                            </div>
                                            <button
                                                onClick={() => { setSearchTerm(''); setYearFilter('All'); }}
                                                className="text-red-600 font-bold text-sm bg-red-50 px-6 py-2 rounded-xl hover:bg-red-100 transition-colors"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-500 group-hover:from-red-50 group-hover:to-red-100 group-hover:text-red-500 transition-all font-black text-lg">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{student.name}</h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                                        <Mail size={12} /> {student.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar size={14} className="text-blue-500" />
                                                    <span className="font-medium">Year {student.year || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <GraduationCap size={14} className="text-purple-500" />
                                                    <span className="font-medium">CGPA: {student.CGPA || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={14} className="text-orange-500" />
                                                <span className="font-medium">{student.distance || 'N/A'} km from campus</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleDeleteClick(student)}
                                                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Modal */}
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

                            <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Student?</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Are you sure you want to remove <span className="font-bold text-gray-900">"{studentToDelete?.name}"</span>?
                                This action is irreversible and all associated data will be lost.
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

export default StudentManagement;
