const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/rooms',      require('./routes/room.routes'));
app.use('/api/tenants',    require('./routes/tenant.routes'));
app.use('/api/rent',       require('./routes/rent.routes'));
app.use('/api/complaints', require('./routes/complaint.routes'));
app.use('/api/notices',    require('./routes/notice.routes'));
app.use('/api/payment',    require('./routes/payment.routes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
