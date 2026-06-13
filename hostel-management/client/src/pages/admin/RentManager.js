import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, CircularProgress, Tooltip, MenuItem, Select,
<<<<<<< HEAD
  FormControl, InputLabel, Tabs, Tab,
=======
  FormControl, InputLabel,
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
<<<<<<< HEAD
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
=======
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
import api from '../../api/axios';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const RentManager = () => {
  const [records, setRecords] = useState([]);
<<<<<<< HEAD
  const [activeTenants, setActiveTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', month: '', year: new Date().getFullYear() });

  // Generate dialog state
  const [genDialog, setGenDialog] = useState(false);
  const [genTab, setGenTab] = useState(0); // 0 = all tenants, 1 = single tenant

  // All-tenants form
  const [allForm, setAllForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [allMsg, setAllMsg] = useState({ text: '', severity: 'info' });
  const [allGenerating, setAllGenerating] = useState(false);

  // Single-tenant form
  const [singleForm, setSingleForm] = useState({
    tenantId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: '',
  });
  const [singleMsg, setSingleMsg] = useState({ text: '', severity: 'info' });
  const [singleGenerating, setSingleGenerating] = useState(false);
=======
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', month: '', year: new Date().getFullYear() });
  const [genDialog, setGenDialog] = useState(false);
  const [genForm, setGenForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [genMsg, setGenMsg] = useState('');
  const [generating, setGenerating] = useState(false);
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b

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

<<<<<<< HEAD
  const fetchActiveTenants = useCallback(async () => {
    const { data } = await api.get('/tenants?isActive=true');
    setActiveTenants(data);
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => { fetchActiveTenants(); }, [fetchActiveTenants]);

  // Pre-fill amount when tenant is selected
  const handleTenantSelect = (tenantId) => {
    const tenant = activeTenants.find(t => t._id === tenantId);
    setSingleForm(f => ({
      ...f,
      tenantId,
      amount: tenant?.room?.monthlyRent?.toString() || '',
    }));
  };
=======
  useEffect(() => { fetchRecords(); }, [fetchRecords]);
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b

  const toggleStatus = async (record) => {
    const endpoint = record.status === 'paid' ? `/rent/${record._id}/unpay` : `/rent/${record._id}/pay`;
    await api.patch(endpoint);
    fetchRecords();
  };

<<<<<<< HEAD
  const openGenDialog = () => {
    setAllMsg({ text: '', severity: 'info' });
    setSingleMsg({ text: '', severity: 'info' });
    setGenTab(0);
    setGenDialog(true);
  };

  const handleGenerateAll = async () => {
    setAllGenerating(true); setAllMsg({ text: '', severity: 'info' });
    try {
      const { data } = await api.post('/rent', allForm);
      setAllMsg({ text: data.message, severity: 'success' });
      fetchRecords();
    } catch (err) {
      setAllMsg({ text: err.response?.data?.message || 'Error generating records', severity: 'error' });
    } finally { setAllGenerating(false); }
  };

  const handleGenerateSingle = async () => {
    if (!singleForm.tenantId) { setSingleMsg({ text: 'Please select a tenant', severity: 'error' }); return; }
    if (!singleForm.amount || Number(singleForm.amount) <= 0) { setSingleMsg({ text: 'Enter a valid amount', severity: 'error' }); return; }
    setSingleGenerating(true); setSingleMsg({ text: '', severity: 'info' });
    try {
      await api.post('/rent/single', {
        tenantId: singleForm.tenantId,
        month: singleForm.month,
        year: singleForm.year,
        amount: singleForm.amount,
      });
      const tenant = activeTenants.find(t => t._id === singleForm.tenantId);
      setSingleMsg({ text: `Record created for ${tenant?.user?.name} — ${MONTHS[singleForm.month - 1]} ${singleForm.year}`, severity: 'success' });
      setSingleForm(f => ({ ...f, tenantId: '', amount: '' }));
      fetchRecords();
    } catch (err) {
      setSingleMsg({ text: err.response?.data?.message || 'Error creating record', severity: 'error' });
    } finally { setSingleGenerating(false); }
=======
  const handleGenerate = async () => {
    setGenerating(true); setGenMsg('');
    try {
      const { data } = await api.post('/rent', genForm);
      setGenMsg(data.message);
      fetchRecords();
    } catch (err) { setGenMsg(err.response?.data?.message || 'Error'); }
    finally { setGenerating(false); }
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Rent Manager</Typography>
          <Typography variant="body2" color="text.secondary">{records.length} records</Typography>
        </Box>
<<<<<<< HEAD
        <Button variant="contained" startIcon={<AddIcon />} onClick={openGenDialog}>
=======
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setGenMsg(''); setGenDialog(true); }}>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
          Generate Records
        </Button>
      </Box>

      {/* Filters */}
<<<<<<< HEAD
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
=======
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
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

<<<<<<< HEAD
      {/* ── Generate Records Dialog ── */}
      <Dialog open={genDialog} onClose={() => setGenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Rent Records</DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={genTab} onChange={(_, v) => setGenTab(v)}>
            <Tab icon={<PeopleIcon fontSize="small" />} iconPosition="start" label="All Tenants" />
            <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Single Tenant" />
          </Tabs>
        </Box>

        {/* Tab 0: All tenants */}
        {genTab === 0 && (
          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Creates unpaid rent records for <strong>all active tenants</strong> for the selected month. Existing records for that period are skipped.
            </Typography>
            {allMsg.text && <Alert severity={allMsg.severity} sx={{ mb: 2 }}>{allMsg.text}</Alert>}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select value={allForm.month} label="Month" onChange={e => setAllForm(f => ({ ...f, month: e.target.value }))}>
                  {MONTHS.map((m, i) => <MenuItem key={m} value={i + 1}>{m}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Year" type="number" value={allForm.year}
                onChange={e => setAllForm(f => ({ ...f, year: e.target.value }))} sx={{ width: 110 }} />
            </Box>
          </DialogContent>
        )}

        {/* Tab 1: Single tenant */}
        {genTab === 1 && (
          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Manually create a rent record for a <strong>specific tenant</strong>. Amount can be overridden (e.g. for late fees or adjustments).
            </Typography>
            {singleMsg.text && <Alert severity={singleMsg.severity} sx={{ mb: 2 }}>{singleMsg.text}</Alert>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Tenant</InputLabel>
                <Select
                  value={singleForm.tenantId}
                  label="Tenant"
                  onChange={e => handleTenantSelect(e.target.value)}
                >
                  {activeTenants.map(t => (
                    <MenuItem key={t._id} value={t._id}>
                      {t.user?.name} — Room #{t.room?.roomNumber} (₹{t.room?.monthlyRent}/mo)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>
                  <Select value={singleForm.month} label="Month" onChange={e => setSingleForm(f => ({ ...f, month: e.target.value }))}>
                    {MONTHS.map((m, i) => <MenuItem key={m} value={i + 1}>{m}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField label="Year" type="number" value={singleForm.year}
                  onChange={e => setSingleForm(f => ({ ...f, year: e.target.value }))} sx={{ width: 110 }} />
              </Box>
              <TextField
                label="Amount (₹)"
                type="number"
                value={singleForm.amount}
                onChange={e => setSingleForm(f => ({ ...f, amount: e.target.value }))}
                helperText="Pre-filled from room rent — edit to add late fee or custom amount"
                required
              />
            </Box>
          </DialogContent>
        )}

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setGenDialog(false)}>Close</Button>
          {genTab === 0 && (
            <Button variant="contained" onClick={handleGenerateAll} disabled={allGenerating}>
              {allGenerating ? 'Generating...' : 'Generate for All'}
            </Button>
          )}
          {genTab === 1 && (
            <Button variant="contained" onClick={handleGenerateSingle} disabled={singleGenerating}>
              {singleGenerating ? 'Creating...' : 'Create Record'}
            </Button>
          )}
=======
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
>>>>>>> d61fee6a42e4e5bd62def9e14e836c4c40be724b
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RentManager;
