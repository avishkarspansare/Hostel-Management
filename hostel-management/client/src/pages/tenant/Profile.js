import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Avatar, Alert, CircularProgress, Divider, Chip,
} from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BedIcon    from '@mui/icons-material/Bed';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ phone: '', address: '', emergencyContact: '' });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState({ text: '', severity: 'info' });

  useEffect(() => {
    api.get('/tenants/me').then(({ data }) => {
      setProfile(data);
      setForm({ phone: data.phone || '', address: data.address || '', emergencyContact: data.emergencyContact || '' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg({ text: '', severity: 'info' });
    try {
      const { data } = await api.put('/tenants/me', form);
      setProfile(data);
      setMsg({ text: 'Profile updated successfully', severity: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Update failed', severity: 'error' });
    } finally { setSaving(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const room = profile?.room;
  const cap  = room?.capacity ?? (room?.type === 'double' ? 2 : 1);

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>My Profile</Typography>

      {/* Identity card (read-only — admin controls name/email) */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.main', fontSize: 22 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Name and email can only be changed by admin.
          </Typography>
        </CardContent>
      </Card>

      {/* Room info */}
      {room && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>Your Room</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography variant="h4" fontWeight={800}>#{room.roomNumber}</Typography>
              <Box>
                <Chip icon={<BedIcon sx={{ fontSize: '13px !important' }} />} label={cap === 2 ? '2-bed' : '1-bed'} size="small" />
                {room.isAC && <Chip icon={<AcUnitIcon sx={{ fontSize: '13px !important' }} />} label="AC" size="small" color="info" sx={{ ml: 0.5 }} />}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">Floor {room.floor}</Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">₹{room.monthlyRent?.toLocaleString('en-IN')} / month</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Editable personal details */}
      <Card>
        <CardContent>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>Personal Details</Typography>
          {msg.text && <Alert severity={msg.severity} sx={{ mb: 2 }}>{msg.text}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Phone"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              multiline rows={3}
            />
            <TextField
              label="Emergency Contact"
              value={form.emergencyContact}
              onChange={e => setForm(f => ({ ...f, emergencyContact: e.target.value }))}
              helperText="Name and phone of someone we can reach in an emergency"
            />
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
