import { useState, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import useFormValidation from '../hooks/useFormValidation';
import { User, Lock, Mail, BookOpen, Calendar, ArrowRight, Loader, AlertCircle, CheckCircle2, MapPin, Hash } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const [loading, setLoading] = useState(false);
    const [calculatedDistance, setCalculatedDistance] = useState(null);
    const [distanceLoading, setDistanceLoading] = useState(false);
    const [distanceError, setDistanceError] = useState('');

    const validate = useCallback((values) => {
        const errors = {};
        
        if (!values.name.trim()) errors.name = 'Full name is required';
        
        if (!values.email) {
            errors.email = 'Enter a valid email address';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = 'Enter a valid email address';
        }

        if (!values.password) {
            errors.password = 'Password must contain at least 8 characters, one uppercase letter, and one special character';
        } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(values.password)) {
            errors.password = 'Password must contain at least 8 characters, one uppercase letter, and one special character';
        }

        if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!values.registerNumber.trim()) errors.registerNumber = 'Registration number is required';
        if (!values.department.trim()) errors.department = 'Department is required';
        if (!values.year) errors.year = 'Year is required';
        if (!values.CGPA) errors.CGPA = 'CGPA is required';
        if (!values.city) errors.city = 'City is required';

        return errors;
    }, []);

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid
    } = useFormValidation({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        registerNumber: '',
        department: '',
        year: '',
        CGPA: '',
        city: '',
        role: 'student'
    }, validate);

    const handleCityBlur = async () => {
        if (!values.city) return;
        
        setDistanceLoading(true);
        setDistanceError('');
        setCalculatedDistance(null);
        
        try {
            const { data } = await api.get(`/auth/distance?city=${encodeURIComponent(values.city)}`);
            setCalculatedDistance(data.distance);
        } catch (err) {
            setDistanceError(err.response?.data?.message || 'Invalid city name');
            console.error('Distance calculation error:', err);
        } finally {
            setDistanceLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;

        setAuthError('');
        setLoading(true);
        try {
            const payload = { ...values };
            delete payload.confirmPassword;

            await api.post('/auth/register', payload);
            navigate('/login');
        } catch (err) {
            setAuthError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h2 className="text-3xl font-bold mb-1">Create Account</h2>
                    <p className="text-indigo-100 text-sm font-medium">Join HostelHub as a Student</p>
                </div>

                <div className="p-8">
                    {authError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100 text-center flex items-center justify-center gap-2">
                            <AlertCircle size={18} />
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={16} className={`${touched.name ? (errors.name ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                        touched.name 
                                            ? (errors.name ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                            : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                    }`}
                                    placeholder="John Doe"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.name && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {errors.name ? <AlertCircle size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={16} className={`${touched.email ? (errors.email ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                        touched.email 
                                            ? (errors.email ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                            : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                    }`}
                                    placeholder="student@university.edu"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.email && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {errors.email ? <AlertCircle size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
                                    </div>
                                )}
                            </div>
                            {touched.email && errors.email && <p className="mt-1 text-[10px] text-red-500 font-medium ml-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className={`${touched.password ? (errors.password ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                            touched.password 
                                                ? (errors.password ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                                : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                        }`}
                                        placeholder="••••••••"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.password && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            {errors.password ? <AlertCircle size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
                                        </div>
                                    )}
                                </div>
                                {touched.password && errors.password && (
                                    <p className="mt-1 text-[10px] text-red-500 font-medium ml-1 leading-tight">{errors.password}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Confirm</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className={`${touched.confirmPassword ? (errors.confirmPassword ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                            touched.confirmPassword 
                                                ? (errors.confirmPassword ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                                : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                        }`}
                                        placeholder="••••••••"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.confirmPassword && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            {errors.confirmPassword ? <AlertCircle size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
                                        </div>
                                    )}
                                </div>
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <p className="mt-1 text-[10px] text-red-500 font-medium ml-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Reg Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash size={16} className={`${touched.registerNumber ? (errors.registerNumber ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="registerNumber"
                                        required
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                            touched.registerNumber 
                                                ? (errors.registerNumber ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                                : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                        }`}
                                        placeholder="REG12345"
                                        value={values.registerNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Department</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen size={16} className={`${touched.department ? (errors.department ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="department"
                                        required
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                            touched.department 
                                                ? (errors.department ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                                : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                        }`}
                                        placeholder="E.g. CS"
                                        value={values.department}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Year</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={16} className={`${touched.year ? (errors.year ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                    </div>
                                    <select
                                        name="year"
                                        required
                                        className={`block w-full pl-10 pr-8 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm appearance-none ${
                                            touched.year 
                                                ? (errors.year ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                                : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                        }`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.year}
                                    >
                                        <option value="" disabled>Select</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">CGPA</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen size={16} className={`${touched.CGPA ? (errors.CGPA ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        name="CGPA"
                                        required
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                            touched.CGPA 
                                                ? (errors.CGPA ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                                : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                        }`}
                                        placeholder="E.g. 8.5"
                                        value={values.CGPA}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">City / Hometown</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin size={16} className={`${touched.city ? (errors.city ? 'text-red-400' : 'text-green-500') : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-sm ${
                                            touched.city 
                                                ? (errors.city ? 'border-red-300 bg-red-50 focus:ring-indigo-500' : 'border-green-300 bg-green-50 focus:ring-green-500')
                                                : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-indigo-500'
                                        }`}
                                        placeholder="E.g. Madurai"
                                        value={values.city}
                                        onChange={handleChange}
                                        onBlur={(e) => {
                                            handleBlur(e);
                                            handleCityBlur();
                                        }}
                                    />
                                    {distanceLoading && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <Loader size={16} className="animate-spin text-indigo-500" />
                                        </div>
                                    )}
                                </div>
                                {calculatedDistance !== null && (
                                    <p className="mt-1 text-[10px] text-green-600 font-medium ml-1 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Distance: {calculatedDistance} km
                                    </p>
                                )}
                                {distanceError && (
                                    <p className="mt-1 text-[10px] text-red-500 font-medium ml-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> {distanceError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isValid || (values.city && calculatedDistance === null && !distanceError && values.city.toLowerCase() !== 'coimbatore')}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
