import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, CircularProgress, Tooltip, MenuItem, Select,
  FormControl, InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api/axios';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const RentManager = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', month: '', year: new Date().getFullYear() });
  const [genDialog, setGenDialog] = useState(false);
  const [genForm, setGenForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [genMsg, setGenMsg] = useState('');
  const [generating, setGenerating] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.month) params.append('month', filter.month);
      if (filter.year) params.append('year', filter.year);
      const { data } = await api.get(`/rent?${params.toString()}`);
      setRecords(data);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const toggleStatus = async (record) => {
    const endpoint = record.status === 'paid' ? `/rent/${record._id}/unpay` : `/rent/${record._id}/pay`;
    await api.patch(endpoint);
    fetchRecords();
  };

  const handleGenerate = async () => {
    setGenerating(true); setGenMsg('');
    try {
      const { data } = await api.post('/rent', genForm);
      setGenMsg(data.message);
      fetchRecords();
    } catch (err) { setGenMsg(err.response?.data?.message || 'Error'); }
    finally { setGenerating(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Rent Manager</Typography>
          <Typography variant="body2" color="text.secondary">{records.length} records</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setGenMsg(''); setGenDialog(true); }}>
          Generate Records
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filter.status} label="Status" onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Month</InputLabel>
          <Select value={filter.month} label="Month" onChange={e => setFilter(f => ({ ...f, month: e.target.value }))}>
            <MenuItem value="">All</MenuItem>
            {MONTHS.map((m, i) => <MenuItem key={m} value={i + 1}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField size="small" label="Year" type="number" value={filter.year}
          onChange={e => setFilter(f => ({ ...f, year: e.target.value }))} sx={{ width: 100 }} />
      </Box>

      {loading ? <CircularProgress /> : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  {['Tenant', 'Room', 'Period', 'Amount', 'Status', 'Paid On', 'Action'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{h.toUpperCase()}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map(rec => (
                  <TableRow key={rec._id} hover>
                    <TableCell>{rec.tenant?.user?.name}</TableCell>
                    <TableCell>#{rec.tenant?.room?.roomNumber}</TableCell>
                    <TableCell>{MONTHS[rec.month - 1]} {rec.year}</TableCell>
                    <TableCell>₹{rec.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Chip label={rec.status} size="small" color={rec.status === 'paid' ? 'success' : 'warning'} />
                    </TableCell>
                    <TableCell>{rec.paidOn ? new Date(rec.paidOn).toLocaleDateString('en-IN') : '—'}</TableCell>
                    <TableCell>
                      <Tooltip title={rec.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid'}>
                        <IconButton size="small" color={rec.status === 'paid' ? 'error' : 'success'} onClick={() => toggleStatus(rec)}>
                          {rec.status === 'paid' ? <CancelIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Generate Records Dialog */}
      <Dialog open={genDialog} onClose={() => setGenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Generate Rent Records</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Creates unpaid rent records for all active tenants for the selected month.
          </Typography>
          {genMsg && <Alert severity="info" sx={{ mb: 2 }}>{genMsg}</Alert>}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select value={genForm.month} label="Month" onChange={e => setGenForm(f => ({ ...f, month: e.target.value }))}>
                {MONTHS.map((m, i) => <MenuItem key={m} value={i + 1}>{m}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Year" type="number" value={genForm.year}
              onChange={e => setGenForm(f => ({ ...f, year: e.target.value }))} sx={{ width: 110 }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setGenDialog(false)}>Close</Button>
          <Button variant="contained" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RentManager;
