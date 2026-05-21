require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');
const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://tutorbook.in'
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

pool.query('SELECT NOW()')
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err.message));

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/subjects',    require('./routes/subjects'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/schedules',   require('./routes/schedules'));
app.use('/api/fees',        require('./routes/fees'));
app.use('/api/attendance',  require('./routes/attendance'));
app.use('/api/reminders',   require('./routes/reminders'));
app.use('/api/payments',    require('./routes/payments'));
app.use('/api/dashboard',   require('./routes/dashboard'));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
