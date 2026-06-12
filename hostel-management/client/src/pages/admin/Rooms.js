import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl, InputLabel,
  FormControlLabel, Switch, Alert, CircularProgress, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';

const EMPTY_FORM = { roomNumber: '', type: 'single', isAC: false, floor: '', monthlyRent: '' };

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, mode: 'add', room: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await api.get('/rooms');
      setRooms(data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const openAdd = () => { setForm(EMPTY_FORM); setError(''); setDialog({ open: true, mode: 'add', room: null }); };
  const openEdit = (room) => {
    setForm({ roomNumber: room.roomNumber, type: room.type, isAC: room.isAC, floor: room.floor, monthlyRent: room.monthlyRent });
    setError('');
    setDialog({ open: true, mode: 'edit', room });
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      if (dialog.mode === 'add') await api.post('/rooms', form);
      else await api.put(`/rooms/${dialog.room._id}`, form);
      setDialog(d => ({ ...d, open: false }));
      fetchRooms();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save room'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/rooms/${deleteId}`); setDeleteId(null); fetchRooms(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Rooms</Typography>
          <Typography variant="body2" color="text.secondary">{rooms.length} rooms total</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Room</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['Room No.', 'Type', 'Floor', 'AC', 'Monthly Rent', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{h.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map(room => (
                <TableRow key={room._id} hover>
                  <TableCell><Typography fontWeight={600}>#{room.roomNumber}</Typography></TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{room.type}</TableCell>
                  <TableCell>Floor {room.floor}</TableCell>
                  <TableCell>
                    <Chip label={room.isAC ? 'AC' : 'Non-AC'} size="small" color={room.isAC ? 'info' : 'default'} />
                  </TableCell>
                  <TableCell>₹{room.monthlyRent.toLocaleString('en-IN')}/mo</TableCell>
                  <TableCell>
                    <Chip label={room.status} size="small" color={room.status === 'occupied' ? 'success' : 'warning'} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(room)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete">
                      <span>
                        <IconButton size="small" color="error" onClick={() => setDeleteId(room._id)} disabled={room.status === 'occupied'}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog(d => ({ ...d, open: false }))} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.mode === 'add' ? 'Add New Room' : 'Edit Room'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Room Number" value={form.roomNumber} onChange={e => setForm(f => ({ ...f, roomNumber: e.target.value }))} required />
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="double">Double</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Floor" type="number" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} required />
            <TextField label="Monthly Rent (₹)" type="number" value={form.monthlyRent} onChange={e => setForm(f => ({ ...f, monthlyRent: e.target.value }))} required />
            <FormControlLabel control={<Switch checked={form.isAC} onChange={e => setForm(f => ({ ...f, isAC: e.target.checked }))} />} label="Air Conditioned" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(d => ({ ...d, open: false }))}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this room?</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rooms;
