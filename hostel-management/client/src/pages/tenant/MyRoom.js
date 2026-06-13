import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Divider, CircularProgress, Avatar } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LayersIcon from '@mui/icons-material/Layers';
import PaymentIcon from '@mui/icons-material/Payment';
import PhoneIcon from '@mui/icons-material/Phone';
import api from '../../api/axios';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}>
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value}</Typography>
    </Box>
  </Box>
);

const MyRoom = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tenants/me').then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (!profile) return <Typography color="error">Profile not found.</Typography>;

  const { user, room, phone, address, joinDate } = profile;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>My Room</Typography>

      {/* Profile card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.main', fontSize: 22 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Chip label="Tenant" size="small" color="secondary" sx={{ mt: 0.5 }} />
            </Box>
          </Box>
          <Divider />
          <InfoRow icon={<PhoneIcon />} label="Phone" value={phone} />
          <Divider />
          <InfoRow icon={<LayersIcon />} label="Address" value={address || 'Not provided'} />
          <Divider />
          <InfoRow icon={<MeetingRoomIcon />} label="Joined" value={new Date(joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
        </CardContent>
      </Card>

      {/* Room details */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Room Details</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h3" fontWeight={800} color="primary">#{room?.roomNumber}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, textAlign: 'center' }}>
                <MeetingRoomIcon color="primary" />
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5, textTransform: 'capitalize' }}>{room?.type}</Typography>
                <Typography variant="caption" color="text.secondary">Room type</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: 2, bgcolor: room?.isAC ? '#EFF6FF' : '#F8FAFC', borderRadius: 2, textAlign: 'center' }}>
                <AcUnitIcon color={room?.isAC ? 'primary' : 'disabled'} />
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>{room?.isAC ? 'Air Conditioned' : 'Non-AC'}</Typography>
                <Typography variant="caption" color="text.secondary">Cooling</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, textAlign: 'center' }}>
                <LayersIcon color="action" />
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>Floor {room?.floor}</Typography>
                <Typography variant="caption" color="text.secondary">Location</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: 2, bgcolor: '#FFF7ED', borderRadius: 2, textAlign: 'center' }}>
                <PaymentIcon color="warning" />
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>₹{room?.monthlyRent?.toLocaleString('en-IN')}</Typography>
                <Typography variant="caption" color="text.secondary">Monthly rent</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyRoom;
