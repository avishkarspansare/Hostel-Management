import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import useAuth from './hooks/useAuth';

// Layouts
<<<<<<< HEAD
import AdminLayout    from './components/AdminLayout';
import TenantLayout   from './components/TenantLayout';
=======
import AdminLayout from './components/AdminLayout';
import TenantLayout from './components/TenantLayout';
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';

// Admin pages
<<<<<<< HEAD
import Dashboard   from './pages/admin/Dashboard';
import Rooms       from './pages/admin/Rooms';
import Tenants     from './pages/admin/Tenants';
import RentManager from './pages/admin/RentManager';
import Complaints  from './pages/admin/Complaints';
import Notices     from './pages/admin/Notices';

// Tenant pages
import MyRoom      from './pages/tenant/MyRoom';
import MyRent      from './pages/tenant/MyRent';
import MyComplaints from './pages/tenant/MyComplaints';
import NoticeBoard  from './pages/tenant/NoticeBoard';
import Profile      from './pages/tenant/Profile';
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/tenant/room'} replace />;
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
<<<<<<< HEAD
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
=======
    <BrowserRouter>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
<<<<<<< HEAD
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
=======
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>
        }>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="rooms"      element={<Rooms />} />
          <Route path="tenants"    element={<Tenants />} />
          <Route path="rent"       element={<RentManager />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="notices"    element={<Notices />} />
        </Route>

        {/* Tenant routes */}
<<<<<<< HEAD
        <Route path="/tenant" element={<ProtectedRoute role="tenant"><TenantLayout /></ProtectedRoute>}>
=======
        <Route path="/tenant" element={
          <ProtectedRoute role="tenant"><TenantLayout /></ProtectedRoute>
        }>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
          <Route index element={<Navigate to="room" replace />} />
          <Route path="room"       element={<MyRoom />} />
          <Route path="rent"       element={<MyRent />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="notices"    element={<NoticeBoard />} />
<<<<<<< HEAD
          <Route path="profile"    element={<Profile />} />
        </Route>

=======
        </Route>

        {/* Catch-all */}
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
