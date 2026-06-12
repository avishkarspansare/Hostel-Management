import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import useAuth from './hooks/useAuth';

// Layouts
import AdminLayout from './components/AdminLayout';
import TenantLayout from './components/TenantLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Rooms from './pages/admin/Rooms';
import Tenants from './pages/admin/Tenants';
import RentManager from './pages/admin/RentManager';
import Complaints from './pages/admin/Complaints';
import Notices from './pages/admin/Notices';

// Tenant pages
import MyRoom from './pages/tenant/MyRoom';
import MyRent from './pages/tenant/MyRent';
import MyComplaints from './pages/tenant/MyComplaints';
import NoticeBoard from './pages/tenant/NoticeBoard';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/tenant/room'} replace />;
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="rooms"      element={<Rooms />} />
          <Route path="tenants"    element={<Tenants />} />
          <Route path="rent"       element={<RentManager />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="notices"    element={<Notices />} />
        </Route>

        {/* Tenant routes */}
        <Route path="/tenant" element={
          <ProtectedRoute role="tenant"><TenantLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="room" replace />} />
          <Route path="room"       element={<MyRoom />} />
          <Route path="rent"       element={<MyRent />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="notices"    element={<NoticeBoard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
