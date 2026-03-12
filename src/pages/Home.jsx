import { Link } from 'react-router-dom';
import { ArrowRight, Building, ShieldCheck, Clock, Users, BarChart3, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center p-6 text-center overflow-hidden relative">

            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Hero Section */}
            <div className="z-10 max-w-4xl mx-auto flex flex-col items-center space-y-8 mt-20">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hostel Room Allocation</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                    A digital platform designed to automate, simplify, and bring transparency to the hostel room allocation process.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link
                        to="/register"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                    >
                        Get Started <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/admin-login"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 hover:text-blue-600 border border-gray-200 rounded-2xl font-semibold shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50"
                    >
                        Admin Access
                    </Link>
                </div>
            </div>

            {/* About Platform */}
            <div className="mt-24 max-w-4xl mx-auto z-10 px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Platform</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                    The Hostel Room Allocation System is a centralized web-based application that enables students 
                    to apply for hostel rooms online while allowing wardens to manage room allocation efficiently. 
                    The system ensures fair distribution based on predefined criteria such as academic merit, 
                    year of study, and distance from hometown.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto z-10 w-full px-4">
                <div className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl border shadow-xl transition-all group">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                        <Building className="text-blue-600" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Live Availability</h3>
                    <p className="text-gray-600">Check real-time room availability before applying.</p>
                </div>

                <div className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl border shadow-xl transition-all group">
                    <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                        <Clock className="text-indigo-600" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Status Updates</h3>
                    <p className="text-gray-600">Track application approval and allocation status instantly.</p>
                </div>

                <div className="bg-white/60 backdrop-blur-lg p-8 rounded-3xl border shadow-xl transition-all group">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck className="text-purple-600" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Access</h3>
                    <p className="text-gray-600">Role-based authentication for students and wardens.</p>
                </div>
            </div>

            {/* How It Works */}
            <div className="mt-28 max-w-6xl mx-auto z-10 px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-10">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <Users className="text-blue-600 mb-4" size={30} />
                        <h4 className="font-semibold text-lg mb-2">1. Student Applies</h4>
                        <p className="text-gray-600">Students submit applications with academic and personal details.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <BarChart3 className="text-indigo-600 mb-4" size={30} />
                        <h4 className="font-semibold text-lg mb-2">2. System Evaluates</h4>
                        <p className="text-gray-600">Applications are prioritized based on year, CGPA, and distance.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <CheckCircle className="text-green-600 mb-4" size={30} />
                        <h4 className="font-semibold text-lg mb-2">3. Room Allocation</h4>
                        <p className="text-gray-600">Rooms are automatically assigned and occupancy updated.</p>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="mt-28 max-w-6xl mx-auto grid md:grid-cols-4 gap-8 z-10 px-4 mb-20">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-3xl font-bold text-blue-600">500+</h3>
                    <p className="text-gray-600">Students Registered</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-3xl font-bold text-indigo-600">300+</h3>
                    <p className="text-gray-600">Rooms Managed</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-3xl font-bold text-purple-600">95%</h3>
                    <p className="text-gray-600">Allocation Accuracy</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h3 className="text-3xl font-bold text-green-600">24/7</h3>
                    <p className="text-gray-600">System Availability</p>
                </div>
            </div>

        </div>
    );
};

export default Home;