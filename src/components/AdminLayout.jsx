import { useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';
import {
    LayoutDashboard,
    Users,
    Building2,
    FileText,
    RefreshCcw,
    BarChart3,
    Settings,
    Bell,
    UserCircle,
    LogOut
} from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    // If not admin, redirect to login
    if (!user || (user.role !== 'admin' && user.role !== 'warden')) {
        return <Navigate to="/admin-login" replace />;
    }

    const adminMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { id: 'students', label: 'Students', icon: Users, path: '/admin/students' },
        { id: 'rooms', label: 'Rooms', icon: Building2, path: '/admin/rooms' },
        { id: 'applications', label: 'Applications', icon: FileText, path: '/admin/applications' },
        { id: 'transfers', label: 'Transfers', icon: RefreshCcw, path: '/admin/transfers' },
        { id: 'reports', label: 'Reports', icon: BarChart3, path: '/admin/reports' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
        { id: 'profile', label: 'Profile', icon: UserCircle, path: '/admin/profile' },
        { id: 'logout', label: 'Logout', icon: LogOut, onClick: logout }
    ];

    const titleRender = () => (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Hostel<span className="text-red-600">Admin</span></h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <Sidebar
                titleRender={titleRender}
                subtitle={user.email}
                items={adminMenuItems}
            />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
