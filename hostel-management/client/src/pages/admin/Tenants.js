import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl, InputLabel,
  Alert, CircularProgress, Avatar, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import api from '../../api/axios';

const EMPTY_FORM = { name: '', email: '', password: '', phone: '', address: '', emergencyContact: '', roomId: '' };

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [vacantRooms, setVacantRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deactivateId, setDeactivateId] = useState(null);

  const fetchData = useCallback(async () => {
    const [t, r] = await Promise.all([api.get('/tenants'), api.get('/rooms?status=vacant')]);
    setTenants(t.data);
    setVacantRooms(r.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    setError('');
    setSaving(true);
    try {
      await api.post('/tenants', form);
      setDialog(false);
      setForm(EMPTY_FORM);
      fetchData();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add tenant'); }
    finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    try { await api.patch(`/tenants/${deactivateId}/deactivate`); setDeactivateId(null); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to deactivate'); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const activeTenants = tenants.filter(t => t.isActive);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Tenants</Typography>
          <Typography variant="body2" color="text.secondary">{activeTenants.length} active tenants</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setForm(EMPTY_FORM); setError(''); setDialog(true); }}>
          Add Tenant
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['Tenant', 'Room', 'Phone', 'Join Date', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{h.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map(t => (
                <TableRow key={t._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
                        {t.user?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{t.user?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.user?.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>Room #{t.room?.roomNumber}</TableCell>
                  <TableCell>{t.phone}</TableCell>
                  <TableCell>{new Date(t.joinDate).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small" color={t.isActive ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>
                    {t.isActive && (
                      <Tooltip title="Vacate tenant">
                        <IconButton size="small" color="warning" onClick={() => setDeactivateId(t._id)}>
                          <PersonOffIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Tenant Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Tenant</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <TextField label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <TextField label="Password (default: hostel@123)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <TextField label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
            <TextField label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            <TextField label="Emergency Contact" value={form.emergencyContact} onChange={e => setForm(f => ({ ...f, emergencyContact: e.target.value }))} />
            <FormControl required>
              <InputLabel>Assign Room</InputLabel>
              <Select value={form.roomId} label="Assign Room" onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}>
                {vacantRooms.map(r => (
                  <MenuItem key={r._id} value={r._id}>
                    Room #{r.roomNumber} — {r.type}, {r.isAC ? 'AC' : 'Non-AC'}, ₹{r.monthlyRent}/mo
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving}>{saving ? 'Adding...' : 'Add Tenant'}</Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirm */}
      <Dialog open={Boolean(deactivateId)} onClose={() => setDeactivateId(null)}>
        <DialogTitle>Vacate Tenant?</DialogTitle>
        <DialogContent><Typography>This will mark the tenant as inactive and free up their room.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeactivateId(null)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleDeactivate}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tenants;
