import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Chip, CircularProgress, Divider } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import api from '../../api/axios';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices').then(r => { setNotices(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Notice Board</Typography>

      {notices.length === 0 && (
        <Card><CardContent sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>No notices posted</CardContent></Card>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {notices.map(n => (
          <Card key={n._id}>
            <CardHeader
              avatar={<CampaignIcon color="primary" />}
              title={<Typography fontWeight={600}>{n.title}</Typography>}
              subheader={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={`By ${n.postedBy?.name}`} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Typography>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{n.message}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default NoticeBoard;
