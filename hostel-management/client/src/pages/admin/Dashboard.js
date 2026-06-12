import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Chip } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Card>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" fontWeight={700} color={color || 'text.primary'}>{value ?? '—'}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{ bgcolor: `${color || 'primary'}.50` || '#EFF6FF', p: 1.5, borderRadius: 2, color: color || 'primary.main' }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roomsRes, tenantsRes, rentRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/tenants'),
          api.get('/rent/summary'),
        ]);
        const rooms = roomsRes.data;
        setStats({
          totalRooms: rooms.length,
          occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
          vacantRooms: rooms.filter(r => r.status === 'vacant').length,
          totalTenants: tenantsRes.data.filter(t => t.isActive).length,
          rent: rentRes.data,
        });
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Welcome back, {user?.name}. Here's what's happening today.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rooms"
            value={stats?.totalRooms}
            subtitle={`${stats?.vacantRooms} vacant`}
            icon={<MeetingRoomIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Occupied Rooms"
            value={stats?.occupiedRooms}
            subtitle={`${stats?.totalRooms ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}% occupancy`}
            icon={<PeopleIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Tenants"
            value={stats?.totalTenants}
            subtitle="Currently residing"
            icon={<PeopleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={`Rent Due (${monthName})`}
            value={`₹${stats?.rent?.totalDue?.toLocaleString('en-IN') || 0}`}
            subtitle={`${stats?.rent?.unpaid || 0} unpaid records`}
            icon={<PaymentIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Rent Status — {monthName}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#F0FDF4', borderRadius: 2, textAlign: 'center' }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />
                  <Typography variant="h5" fontWeight={700} color="success.main">{stats?.rent?.paid || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Paid</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#FFF7ED', borderRadius: 2, textAlign: 'center' }}>
                  <PaymentIcon sx={{ color: 'warning.main', fontSize: 32 }} />
                  <Typography variant="h5" fontWeight={700} color="warning.main">{stats?.rent?.unpaid || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Unpaid</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Room Occupancy</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#EFF6FF', borderRadius: 2, textAlign: 'center' }}>
                  <MeetingRoomIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Typography variant="h5" fontWeight={700} color="primary.main">{stats?.occupiedRooms}</Typography>
                  <Typography variant="body2" color="text.secondary">Occupied</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, textAlign: 'center' }}>
                  <MeetingRoomIcon sx={{ color: 'text.secondary', fontSize: 32 }} />
                  <Typography variant="h5" fontWeight={700}>{stats?.vacantRooms}</Typography>
                  <Typography variant="body2" color="text.secondary">Vacant</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
