const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// ── Scheduled jobs ───────────────────────────────────────────────────────────
const { scheduleAutoLunchCheckout } = require('./jobs/autoLunchCheckout');
scheduleAutoLunchCheckout();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/users',      require('./routes/userRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/reports',    require('./routes/reportsRoutes'));
app.use('/api/shift',      require('./routes/shiftRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/leaves',       require('./routes/leaveRoutes'));

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'API running', ts: new Date().toISOString() })
);

app.use((req, res) =>
  res.status(404).json({ success: false, message: `${req.method} ${req.originalUrl} not found` })
);

app.use((err, _req, res, _next) => {
  console.error('Unhandled:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server on http://localhost:${PORT} [${process.env.NODE_ENV}]`)
);
