import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl, InputLabel,
<<<<<<< HEAD
  FormControlLabel, Switch, Alert, CircularProgress, Tooltip, Avatar,
} from '@mui/material';
import AddIcon        from '@mui/icons-material/Add';
import EditIcon       from '@mui/icons-material/Edit';
import DeleteIcon     from '@mui/icons-material/Delete';
import BedIcon        from '@mui/icons-material/Bed';
import AcUnitIcon     from '@mui/icons-material/AcUnit';
import PeopleAltIcon  from '@mui/icons-material/PeopleAlt';
=======
  FormControlLabel, Switch, Alert, CircularProgress, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
import api from '../../api/axios';

const EMPTY_FORM = { roomNumber: '', type: 'single', isAC: false, floor: '', monthlyRent: '' };

<<<<<<< HEAD
const statusColor = { vacant: 'warning', partial: 'info', occupied: 'success' };
const statusLabel = { vacant: 'Vacant', partial: 'Partial', occupied: 'Full' };

const Rooms = () => {
  const [rooms, setRooms]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dialog, setDialog]         = useState({ open: false, mode: 'add', room: null });
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [deleteId, setDeleteId]     = useState(null);
  const [detailRoom, setDetailRoom] = useState(null);
=======
const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, mode: 'add', room: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await api.get('/rooms');
      setRooms(data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

<<<<<<< HEAD
  const openAdd  = () => { setForm(EMPTY_FORM); setError(''); setDialog({ open: true, mode: 'add', room: null }); };
=======
  const openAdd = () => { setForm(EMPTY_FORM); setError(''); setDialog({ open: true, mode: 'add', room: null }); };
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
  const openEdit = (room) => {
    setForm({ roomNumber: room.roomNumber, type: room.type, isAC: room.isAC, floor: room.floor, monthlyRent: room.monthlyRent });
    setError('');
    setDialog({ open: true, mode: 'edit', room });
  };

  const handleSave = async () => {
<<<<<<< HEAD
    setError(''); setSaving(true);
    try {
      if (dialog.mode === 'add') await api.post('/rooms', form);
      else                       await api.put(`/rooms/${dialog.room._id}`, form);
=======
    setError('');
    setSaving(true);
    try {
      if (dialog.mode === 'add') await api.post('/rooms', form);
      else await api.put(`/rooms/${dialog.room._id}`, form);
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
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

<<<<<<< HEAD
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const partial  = rooms.filter(r => r.status === 'partial').length;
  const vacant   = rooms.filter(r => r.status === 'vacant').length;

=======
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Rooms</Typography>
<<<<<<< HEAD
          <Typography variant="body2" color="text.secondary">
            {rooms.length} total · {occupied} full · {partial} partial · {vacant} vacant
          </Typography>
=======
          <Typography variant="body2" color="text.secondary">{rooms.length} rooms total</Typography>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Room</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
<<<<<<< HEAD
                {['Room', 'Beds', 'Floor', 'Rent / head', 'Status', "Who's inside", 'Actions'].map(h => (
=======
                {['Room No.', 'Type', 'Floor', 'AC', 'Monthly Rent', 'Status', 'Actions'].map(h => (
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{h.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
<<<<<<< HEAD
              {rooms.map(room => {
                const capacity = room.capacity ?? (room.type === 'double' ? 2 : 1);
                return (
                  <TableRow key={room._id} hover>

                    {/* Room number */}
                    <TableCell>
                      <Typography fontWeight={700} fontSize={15}>#{room.roomNumber}</Typography>
                      {room.isAC && (
                        <Chip
                          icon={<AcUnitIcon sx={{ fontSize: '12px !important' }} />}
                          label="AC" size="small" color="info"
                          sx={{ mt: 0.3, height: 18, fontSize: 10 }}
                        />
                      )}
                    </TableCell>

                    {/* Beds — just the chip, no dots or counter */}
                    <TableCell>
                      <Chip
                        icon={<BedIcon sx={{ fontSize: '13px !important' }} />}
                        label={capacity === 2 ? '2-bed' : '1-bed'}
                        size="small"
                        color={capacity === 2 ? 'secondary' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    {/* Floor */}
                    <TableCell>Floor {room.floor}</TableCell>

                    {/* Rent per head */}
                    <TableCell>
                      <Typography fontWeight={600}>₹{room.monthlyRent?.toLocaleString('en-IN')}</Typography>
                      <Typography variant="caption" color="text.secondary">per head / mo</Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={statusLabel[room.status] ?? room.status}
                        size="small"
                        color={statusColor[room.status] ?? 'default'}
                      />
                    </TableCell>

                    {/* Who's inside */}
                    <TableCell>
                      {!room.tenants?.length ? (
                        <Typography variant="caption" color="text.disabled" fontStyle="italic">Nobody yet</Typography>
                      ) : (
                        <Tooltip title="Click for details" arrow>
                          <Box sx={{ cursor: 'pointer' }} onClick={() => setDetailRoom(room)}>
                            {room.tenants.map(t => (
                              <Box key={t._id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.4 }}>
                                <Avatar sx={{ width: 22, height: 22, fontSize: 11, bgcolor: 'primary.main' }}>
                                  {t.user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="caption" fontWeight={500}>{t.user?.name}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Tooltip>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Tooltip title="Edit room">
                        <IconButton size="small" onClick={() => openEdit(room)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={room.tenants?.length ? 'Cannot delete — has tenants' : 'Delete room'}>
                        <span>
                          <IconButton size="small" color="error" onClick={() => setDeleteId(room._id)} disabled={!!room.tenants?.length}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

<<<<<<< HEAD
      {/* ── Add / Edit Room Dialog ── */}
      <Dialog open={dialog.open} onClose={() => setDialog(d => ({ ...d, open: false }))} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.mode === 'add' ? 'Add New Room' : `Edit Room #${dialog.room?.roomNumber}`}</DialogTitle>
=======
      {/* Add/Edit Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog(d => ({ ...d, open: false }))} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog.mode === 'add' ? 'Add New Room' : 'Edit Room'}</DialogTitle>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Room Number" value={form.roomNumber} onChange={e => setForm(f => ({ ...f, roomNumber: e.target.value }))} required />
            <FormControl>
<<<<<<< HEAD
              <InputLabel>Bed type</InputLabel>
              <Select value={form.type} label="Bed type" onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <MenuItem value="single">1-bed (single)</MenuItem>
                <MenuItem value="double">2-bed (double)</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Floor" type="number" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} required />
            <TextField
              label="Monthly Rent per head (₹)" type="number"
              value={form.monthlyRent}
              onChange={e => setForm(f => ({ ...f, monthlyRent: e.target.value }))}
              helperText="Amount charged per person per month"
              required
            />
            <FormControlLabel
              control={<Switch checked={form.isAC} onChange={e => setForm(f => ({ ...f, isAC: e.target.checked }))} />}
              label="Air Conditioned"
            />
=======
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="double">Double</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Floor" type="number" value={form.floor} onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} required />
            <TextField label="Monthly Rent (₹)" type="number" value={form.monthlyRent} onChange={e => setForm(f => ({ ...f, monthlyRent: e.target.value }))} required />
            <FormControlLabel control={<Switch checked={form.isAC} onChange={e => setForm(f => ({ ...f, isAC: e.target.checked }))} />} label="Air Conditioned" />
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(d => ({ ...d, open: false }))}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

<<<<<<< HEAD
      {/* ── Who's Inside Modal ── */}
      <Dialog open={Boolean(detailRoom)} onClose={() => setDetailRoom(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleAltIcon color="primary" />
            Room #{detailRoom?.roomNumber} — Residents
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={detailRoom?.capacity === 2 ? '2-bed' : '1-bed'} size="small" />
            {detailRoom?.isAC && <Chip label="AC" size="small" color="info" />}
            <Chip label={`Floor ${detailRoom?.floor}`} size="small" />
            <Chip label={`₹${detailRoom?.monthlyRent?.toLocaleString('en-IN')} / head`} size="small" color="success" />
          </Box>
          {detailRoom?.tenants?.map((t, i) => (
            <Box key={t._id} sx={{
              display: 'flex', alignItems: 'center', gap: 2, py: 1.5,
              borderTop: i === 0 ? 'none' : '1px solid #F1F5F9',
            }}>
              <Avatar sx={{ width: 42, height: 42, bgcolor: 'primary.main', fontSize: 18 }}>
                {t.user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{t.user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{t.user?.email}</Typography>
                {t.phone && <Typography variant="caption">📞 {t.phone}</Typography>}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailRoom(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Room?</DialogTitle>
        <DialogContent><Typography>This action cannot be undone.</Typography></DialogContent>
=======
      {/* Delete Confirm */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this room?</Typography></DialogContent>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Rooms;
