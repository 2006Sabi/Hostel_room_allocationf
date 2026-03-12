import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Home, Building2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                            HostelHub
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link
                                    to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                >
                                    <Home size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                                    <Link
                                        to={user.role === 'admin' ? '/admin/dashboard' : '/student/profile'}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        <div className="bg-indigo-100 text-indigo-700 p-1.5 rounded-full">
                                            <User size={16} />
                                        </div>
                                        <span className="font-medium text-sm hidden sm:block">{user.name || user.email}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium"
                                    >
                                        <LogOut size={16} />
                                        <span className="hidden sm:block">Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
