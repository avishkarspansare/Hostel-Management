import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Card, CardContent, CardHeader, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
  CircularProgress, Divider, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CampaignIcon from '@mui/icons-material/Campaign';
import api from '../../api/axios';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ title: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    const { data } = await api.get('/notices');
    setNotices(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleAdd = async () => {
    setError('');
    setSaving(true);
    try {
      await api.post('/notices', form);
      setDialog(false);
      setForm({ title: '', message: '' });
      fetch();
    } catch (err) { setError(err.response?.data?.message || 'Failed to post notice'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await api.delete(`/notices/${id}`);
    fetch();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Notice Board</Typography>
          <Typography variant="body2" color="text.secondary">{notices.length} notices</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setForm({ title: '', message: '' }); setError(''); setDialog(true); }}>
          Post Notice
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {notices.length === 0 && (
          <Card><CardContent sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>No notices posted yet</CardContent></Card>
        )}
        {notices.map(n => (
          <Card key={n._id}>
            <CardHeader
              avatar={<CampaignIcon color="primary" />}
              title={<Typography fontWeight={600}>{n.title}</Typography>}
              subheader={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                  <Chip label={`By ${n.postedBy?.name}`} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              }
              action={
                <IconButton color="error" onClick={() => handleDelete(n._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{n.message}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post New Notice</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            <TextField label="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} multiline rows={4} required />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={saving}>{saving ? 'Posting...' : 'Post Notice'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notices;
