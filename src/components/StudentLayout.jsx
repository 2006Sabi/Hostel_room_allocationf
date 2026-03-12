import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AuthContext from '../context/AuthContext';
import { Home, Building, ClipboardList, Info, Repeat, User, Bell } from 'lucide-react';

const StudentLayout = () => {
    const { user } = useContext(AuthContext);

    const studentLinks = [
        { path: '/student/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/student/rooms', icon: Building, label: 'View Rooms' },
        { path: '/student/apply', icon: ClipboardList, label: 'Apply for Room' },
        { path: '/student/status', icon: Info, label: 'Application Status' },
        { path: '/student/transfer', icon: Repeat, label: 'Request Transfer' },
        { path: '/student/notifications', icon: Bell, label: 'Notifications' },
        { path: '/student/profile', icon: User, label: 'Profile' },
    ];

    const titleRender = () => (
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Student<span className="text-blue-500">Panel</span></h2>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
            <Sidebar
                titleRender={titleRender}
                subtitle={user?.email}
                items={studentLinks}
            />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default StudentLayout;
