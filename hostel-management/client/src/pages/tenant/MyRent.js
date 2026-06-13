import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, CircularProgress,
  Divider, Button, Alert, Snackbar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PaymentIcon from '@mui/icons-material/Payment';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MyRent = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null); // tracks which record is being paid
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const fetchRecords = useCallback(async () => {
    try {
      const { data } = await api.get('/rent/me');
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const showSnack = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

  const handlePayNow = async (record) => {
    setPayingId(record._id);
    try {
      // Step 1: Ask backend to create a Razorpay order
      const { data: order } = await api.post('/payment/create-order', { rentRecordId: record._id });

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: order.keyId,                         // Your Razorpay Key ID (from backend)
        amount: order.amount,                     // Amount in paise
        currency: order.currency,
        name: 'HostelMS',
        description: `Rent for ${MONTHS[record.month - 1]} ${record.year}`,
        order_id: order.orderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#2563EB' },

        // Step 3: On successful payment, verify with backend
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              rentRecordId:        record._id,
            });
            showSnack('Payment successful! Rent marked as paid.', 'success');
            fetchRecords(); // refresh the list
          } catch {
            showSnack('Payment done but verification failed. Contact admin.', 'error');
          }
        },

        modal: {
          ondismiss: () => setPayingId(null), // reset if user closes modal
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failures inside the modal
      rzp.on('payment.failed', (response) => {
        showSnack(`Payment failed: ${response.error.description}`, 'error');
        setPayingId(null);
      });

      rzp.open();
    } catch (err) {
      showSnack(err.response?.data?.message || 'Could not initiate payment', 'error');
      setPayingId(null);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const unpaid = records.filter(r => r.status === 'unpaid');
  const totalDue = unpaid.reduce((s, r) => s + r.amount, 0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Rent History</Typography>

      {/* Due banner */}
      {unpaid.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
            <PendingIcon color="warning" />
            <Box>
              <Typography variant="body2" fontWeight={600}>Rent Due</Typography>
              <Typography variant="caption" color="text.secondary">
                ₹{totalDue.toLocaleString('en-IN')} pending across {unpaid.length} month(s)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        {records.length === 0 && (
          <CardContent sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            No rent records found
          </CardContent>
        )}

        {records.map((rec, idx) => (
          <Box key={rec._id}>
            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              {/* Left — status icon + month/year */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {rec.status === 'paid'
                  ? <CheckCircleIcon color="success" />
                  : <PendingIcon color="warning" />}
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {MONTHS[rec.month - 1]} {rec.year}
                  </Typography>
                  {rec.status === 'paid' && rec.paidOn && (
                    <Typography variant="caption" color="text.secondary">
                      Paid on {new Date(rec.paidOn).toLocaleDateString('en-IN')}
                    </Typography>
                  )}
                  {rec.razorpayPaymentId && (
                    <Typography variant="caption" color="text.disabled" display="block">
                      ID: {rec.razorpayPaymentId}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Right — amount + chip + pay button */}
              <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.75 }}>
                <Typography variant="body2" fontWeight={600}>
                  ₹{rec.amount.toLocaleString('en-IN')}
                </Typography>
                <Chip
                  label={rec.status}
                  size="small"
                  color={rec.status === 'paid' ? 'success' : 'warning'}
                />
                {rec.status === 'unpaid' && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    onClick={() => handlePayNow(rec)}
                    disabled={payingId === rec._id}
                    sx={{ mt: 0.5, fontSize: 12 }}
                  >
                    {payingId === rec._id ? 'Opening...' : 'Pay Now'}
                  </Button>
                )}
              </Box>
            </Box>

            {idx < records.length - 1 && <Divider />}
          </Box>
        ))}
      </Card>

      {/* Success / error snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyRent;
