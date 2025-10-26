const express = require('express');
const cors = require('cors');
const swagger = require('./swagger');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Swagger docs
swagger(app);

// Health routes requeridas


/**
 * @openapi
 * /ping:
 *   get:
 *     summary: Verifica el estado del servidor
 *     responses:
 *       200:
 *         description: Servidor activo
 */
app.get('/ping', (req, res) => res.status(200).end());

/**
 * @openapi
 * /about:
 *   get:
 *     summary: Información del autor
 *     responses:
 *       200:
 *         description: Datos del autor
 */


app.get('/about', (req, res) => res.json({
  status: 'success',
  data: {
    nombreCompleto: process.env.NOMBRE_COMPLETO || 'Tomas Briceño',
    cedula: process.env.CEDULA || '31141965',
    seccion: process.env.SECCION || '1'
  }
}));

// ✅ NUEVA RUTA RAÍZ
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API funcionando correctamente 🚀',
    endpoints: {
      docs: '/api-docs',
      ping: '/ping',
      about: '/about',
      users: '/users',
      auth: '/auth'
    }
  });
});

// Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

module.exports = app;
