import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import ViewRooms from './pages/ViewRooms';
import ApplyRoom from './pages/ApplyRoom';
import ApplicationStatus from './pages/ApplicationStatus';
import Profile from './pages/Profile';
import TransferRequest from './pages/TransferRequest';
import Notifications from './pages/Notifications';
import StudentLayout from './components/StudentLayout';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import RoomManagement from './pages/admin/RoomManagement';
import ApplicationManagement from './pages/admin/ApplicationManagement';
import TransferManagement from './pages/admin/TransferManagement';
import Reports from './pages/admin/Reports';
import AllocationSettings from './pages/admin/AllocationSettings';
import NotificationManagement from './pages/admin/NotificationManagement';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Student Protected Routes */}
              <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="rooms" element={<ViewRooms />} />
                <Route path="apply" element={<ApplyRoom />} />
                <Route path="status" element={<ApplicationStatus />} />
                <Route path="transfer" element={<TransferRequest />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['warden', 'admin']}><AdminLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<StudentManagement />} />
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="applications" element={<ApplicationManagement />} />
                <Route path="transfers" element={<TransferManagement />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<AllocationSettings />} />
                <Route path="notifications" element={<NotificationManagement />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
