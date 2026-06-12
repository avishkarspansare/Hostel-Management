import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Tooltip, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';

const STATUS_COLORS = { open: 'error', in_progress: 'warning', resolved: 'success' };
const STATUS_LABELS = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved' };

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    const { data } = await api.get(`/complaints${params}`);
    setComplaints(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id, status) => {
    await api.patch(`/complaints/${id}/status`, { status });
    fetch();
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    await api.delete(`/complaints/${id}`);
    fetch();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Complaints</Typography>
          <Typography variant="body2" color="text.secondary">{complaints.length} complaints</Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter by status</InputLabel>
          <Select value={filter} label="Filter by status" onChange={e => setFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['Tenant', 'Room', 'Title', 'Description', 'Status', 'Date', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{h.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map(c => (
                <TableRow key={c._id} hover>
                  <TableCell>{c.tenant?.user?.name}</TableCell>
                  <TableCell>#{c.tenant?.room?.roomNumber || '—'}</TableCell>
                  <TableCell><Typography variant="body2" fontWeight={500}>{c.title}</Typography></TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select size="small" value={c.status} onChange={e => updateStatus(c._id, e.target.value)}
                      sx={{ minWidth: 130, '& .MuiSelect-select': { py: 0.5 } }}>
                      <MenuItem value="open"><Chip label="Open" size="small" color="error" /></MenuItem>
                      <MenuItem value="in_progress"><Chip label="In Progress" size="small" color="warning" /></MenuItem>
                      <MenuItem value="resolved"><Chip label="Resolved" size="small" color="success" /></MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => deleteComplaint(c._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {complaints.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No complaints found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Complaints;
