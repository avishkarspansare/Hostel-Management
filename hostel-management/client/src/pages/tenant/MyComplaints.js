import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, CircularProgress, Divider, Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api/axios';

const STATUS_COLOR = { open: 'error', in_progress: 'warning', resolved: 'success' };
const STATUS_LABEL = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved' };

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchComplaints = useCallback(async () => {
    const { data } = await api.get('/complaints/me');
    setComplaints(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    try {
      await api.post('/complaints', form);
      setDialog(false);
      setForm({ title: '', description: '' });
      fetchComplaints();
    } catch (err) { setError(err.response?.data?.message || 'Failed to submit complaint'); }
    finally { setSaving(false); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h5" gutterBottom>My Complaints</Typography>

      {complaints.length === 0 && (
        <Card><CardContent sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>No complaints raised yet</CardContent></Card>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {complaints.map(c => (
          <Card key={c._id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="body1" fontWeight={600}>{c.title}</Typography>
                <Chip label={STATUS_LABEL[c.status]} size="small" color={STATUS_COLOR[c.status]} />
              </Box>
              <Typography variant="body2" color="text.secondary">{c.description}</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Fab color="primary" sx={{ position: 'fixed', bottom: 80, right: 16 }} onClick={() => { setForm({ title: '', description: '' }); setError(''); setDialog(true); }}>
        <AddIcon />
      </Fab>

      <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Raise a Complaint</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline rows={4} required />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>{saving ? 'Submitting...' : 'Submit'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyComplaints;
