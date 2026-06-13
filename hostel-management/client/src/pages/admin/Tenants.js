import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl, InputLabel,
<<<<<<< HEAD
  Alert, CircularProgress, Avatar, Tooltip, Divider,
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import EditIcon       from '@mui/icons-material/Edit';
import PersonOffIcon  from '@mui/icons-material/PersonOff';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import api from '../../api/axios';

const EMPTY_ADD  = { name: '', email: '', password: '', phone: '', address: '', emergencyContact: '', roomId: '' };
const EMPTY_EDIT = { name: '', email: '', phone: '', address: '', emergencyContact: '' };

const Tenants = () => {
  const [tenants, setTenants]         = useState([]);
  const [availableRooms, setAvailable] = useState([]); // vacant + partial rooms
  const [loading, setLoading]         = useState(true);

  const [addDialog, setAddDialog]     = useState(false);
  const [addForm, setAddForm]         = useState(EMPTY_ADD);
  const [addSaving, setAddSaving]     = useState(false);
  const [addError, setAddError]       = useState('');

  const [editDialog, setEditDialog]   = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [editForm, setEditForm]       = useState(EMPTY_EDIT);
  const [editSaving, setEditSaving]   = useState(false);
  const [editError, setEditError]     = useState('');

  const [roomChanging, setRoomChanging]     = useState(false);
  const [newRoomId, setNewRoomId]           = useState('');
  const [roomChangeMsg, setRoomChangeMsg]   = useState({ text: '', severity: 'info' });

  const [deactivateId, setDeactivateId]     = useState(null);

  const fetchData = useCallback(async () => {
    const [t, r] = await Promise.all([
      api.get('/tenants'),
      // rooms that are not full: vacant + partial
      api.get('/rooms'),
    ]);
    setTenants(t.data);
    // filter to rooms that have capacity left
    const notFull = r.data.filter(room => {
      const cap    = room.capacity ?? (room.type === 'double' ? 2 : 1);
      const filled = room.tenants?.length ?? 0;
      return filled < cap;
    });
    setAvailable(notFull);
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

<<<<<<< HEAD
  // sort: active first, inactive at the bottom
  const sorted = [...tenants].sort((a, b) => {
    if (a.isActive === b.isActive) return 0;
    return a.isActive ? -1 : 1;
  });

  /* ── Add ── */
  const handleAdd = async () => {
    setAddError(''); setAddSaving(true);
    try {
      await api.post('/tenants', addForm);
      setAddDialog(false); setAddForm(EMPTY_ADD);
      fetchData();
    } catch (err) { setAddError(err.response?.data?.message || 'Failed to add tenant'); }
    finally { setAddSaving(false); }
  };

  /* ── Open edit ── */
  const openEdit = (t) => {
    setEditTarget(t);
    setEditForm({ name: t.user?.name || '', email: t.user?.email || '', phone: t.phone || '', address: t.address || '', emergencyContact: t.emergencyContact || '' });
    setNewRoomId(''); setRoomChangeMsg({ text: '', severity: 'info' }); setEditError('');
    setEditDialog(true);
  };

  /* ── Save profile ── */
  const handleEdit = async () => {
    setEditError(''); setEditSaving(true);
    try {
      await api.put(`/tenants/${editTarget._id}`, editForm);
      setEditDialog(false); fetchData();
    } catch (err) { setEditError(err.response?.data?.message || 'Failed to update'); }
    finally { setEditSaving(false); }
  };

  /* ── Change room ── */
  const handleRoomChange = async () => {
    if (!newRoomId) { setRoomChangeMsg({ text: 'Select a room first', severity: 'error' }); return; }
    setRoomChanging(true); setRoomChangeMsg({ text: '', severity: 'info' });
    try {
      const { data } = await api.patch(`/tenants/${editTarget._id}/room`, { roomId: newRoomId });
      setEditTarget(data);
      setNewRoomId('');
      setRoomChangeMsg({ text: `Moved to Room #${data.room?.roomNumber}`, severity: 'success' });
      fetchData();
    } catch (err) {
      setRoomChangeMsg({ text: err.response?.data?.message || 'Room change failed', severity: 'error' });
    } finally { setRoomChanging(false); }
  };

  /* ── Deactivate ── */
=======
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

>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
  const handleDeactivate = async () => {
    try { await api.patch(`/tenants/${deactivateId}/deactivate`); setDeactivateId(null); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to deactivate'); }
  };

<<<<<<< HEAD
  // rooms eligible for the room-change picker: not full, and not the tenant's current room
  const roomsForPicker = availableRooms.filter(r => r._id !== editTarget?.room?._id);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  const active = tenants.filter(t => t.isActive).length;
=======
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const activeTenants = tenants.filter(t => t.isActive);
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Tenants</Typography>
<<<<<<< HEAD
          <Typography variant="body2" color="text.secondary">{active} active · {tenants.length - active} inactive</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setAddForm(EMPTY_ADD); setAddError(''); setAddDialog(true); }}>
=======
          <Typography variant="body2" color="text.secondary">{activeTenants.length} active tenants</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setForm(EMPTY_FORM); setError(''); setDialog(true); }}>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
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
<<<<<<< HEAD
              {sorted.map(t => (
                <TableRow key={t._id} hover sx={{ opacity: t.isActive ? 1 : 0.5 }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: t.isActive ? 'primary.main' : 'action.disabled', fontSize: 13 }}>
=======
              {tenants.map(t => (
                <TableRow key={t._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
                        {t.user?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{t.user?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.user?.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
<<<<<<< HEAD
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>#{t.room?.roomNumber}</Typography>
                      <Chip label={t.room?.type === 'double' ? '2-bed' : '1-bed'} size="small" sx={{ fontSize: 10, height: 18 }} />
                    </Box>
                  </TableCell>
=======
                  <TableCell>Room #{t.room?.roomNumber}</TableCell>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
                  <TableCell>{t.phone}</TableCell>
                  <TableCell>{new Date(t.joinDate).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <Chip label={t.isActive ? 'Active' : 'Inactive'} size="small" color={t.isActive ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>
<<<<<<< HEAD
                    <Tooltip title="Edit tenant">
                      <IconButton size="small" color="primary" onClick={() => openEdit(t)}><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    {t.isActive && (
                      <Tooltip title="Vacate tenant">
                        <IconButton size="small" color="warning" onClick={() => setDeactivateId(t._id)}><PersonOffIcon fontSize="small" /></IconButton>
=======
                    {t.isActive && (
                      <Tooltip title="Vacate tenant">
                        <IconButton size="small" color="warning" onClick={() => setDeactivateId(t._id)}>
                          <PersonOffIcon fontSize="small" />
                        </IconButton>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

<<<<<<< HEAD
      {/* ── Add Tenant ── */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Tenant</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Full Name"   value={addForm.name}             onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required />
            <TextField label="Email"       value={addForm.email}            onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} type="email" required />
            <TextField label="Password (default: hostel@123)" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} />
            <TextField label="Phone"       value={addForm.phone}            onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} required />
            <TextField label="Address"     value={addForm.address}          onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} />
            <TextField label="Emergency Contact" value={addForm.emergencyContact} onChange={e => setAddForm(f => ({ ...f, emergencyContact: e.target.value }))} />
            <FormControl required>
              <InputLabel>Assign Room</InputLabel>
              <Select value={addForm.roomId} label="Assign Room" onChange={e => setAddForm(f => ({ ...f, roomId: e.target.value }))}>
                {availableRooms.map(r => {
                  const cap = r.capacity ?? (r.type === 'double' ? 2 : 1);
                  const filled = r.tenants?.length ?? 0;
                  return (
                    <MenuItem key={r._id} value={r._id}>
                      Room #{r.roomNumber} — {cap === 2 ? '2-bed' : '1-bed'}{r.isAC ? ', AC' : ''} · {filled}/{cap} filled · ₹{r.monthlyRent}/head
                    </MenuItem>
                  );
                })}
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
<<<<<<< HEAD
          <Button onClick={() => setAddDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={addSaving}>{addSaving ? 'Adding...' : 'Add Tenant'}</Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Tenant ── */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{editTarget?.user?.name?.charAt(0)}</Avatar>
            <Box>
              <Typography fontWeight={700}>{editTarget?.user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Room #{editTarget?.room?.roomNumber} · {editTarget?.room?.type === 'double' ? '2-bed' : '1-bed'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Profile Details</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Full Name"        value={editForm.name}             onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
            <TextField label="Email"            value={editForm.email}            onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} type="email" required />
            <TextField label="Phone"            value={editForm.phone}            onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
            <TextField label="Address"          value={editForm.address}          onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} multiline rows={2} />
            <TextField label="Emergency Contact" value={editForm.emergencyContact} onChange={e => setEditForm(f => ({ ...f, emergencyContact: e.target.value }))} />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <MeetingRoomIcon fontSize="small" color="primary" />
            <Typography variant="overline" color="text.secondary">Change Room</Typography>
          </Box>
          {roomChangeMsg.text && <Alert severity={roomChangeMsg.severity} sx={{ mb: 2 }}>{roomChangeMsg.text}</Alert>}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Move to room</InputLabel>
              <Select value={newRoomId} label="Move to room" onChange={e => setNewRoomId(e.target.value)}>
                {roomsForPicker.length === 0 && <MenuItem disabled>No rooms with available beds</MenuItem>}
                {roomsForPicker.map(r => {
                  const cap    = r.capacity ?? (r.type === 'double' ? 2 : 1);
                  const filled = r.tenants?.length ?? 0;
                  return (
                    <MenuItem key={r._id} value={r._id}>
                      Room #{r.roomNumber} · {cap === 2 ? '2-bed' : '1-bed'}{r.isAC ? ' AC' : ''} · {filled}/{cap} filled · ₹{r.monthlyRent}/head
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleRoomChange} disabled={roomChanging || !newRoomId} sx={{ whiteSpace: 'nowrap', minWidth: 110 }}>
              {roomChanging ? 'Moving…' : 'Move Room'}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Old bed freed automatically. Double rooms can hold 2 tenants simultaneously.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit} disabled={editSaving}>{editSaving ? 'Saving…' : 'Save Profile'}</Button>
        </DialogActions>
      </Dialog>

      {/* ── Deactivate Confirm ── */}
      <Dialog open={Boolean(deactivateId)} onClose={() => setDeactivateId(null)}>
        <DialogTitle>Vacate Tenant?</DialogTitle>
        <DialogContent><Typography>Tenant will be marked inactive and their bed freed.</Typography></DialogContent>
=======
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving}>{saving ? 'Adding...' : 'Add Tenant'}</Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirm */}
      <Dialog open={Boolean(deactivateId)} onClose={() => setDeactivateId(null)}>
        <DialogTitle>Vacate Tenant?</DialogTitle>
        <DialogContent><Typography>This will mark the tenant as inactive and free up their room.</Typography></DialogContent>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeactivateId(null)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleDeactivate}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tenants;
