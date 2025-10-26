const express = require('express');
const cors = require('cors');
const swagger = require('./swagger');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

swagger(app);

// Health routes required by original P3
app.get('/ping', (req, res) => res.status(200).end());
app.get('/about', (req, res) => res.json({
  status: 'success',
  data: { nombreCompleto: process.env.NOMBRE_COMPLETO || 'Tu Nombre', cedula: process.env.CEDULA || 'TU_CEDULA', seccion: process.env.SECCION || 'TU_SECCION' }
}));

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

module.exports = app;
