const express = require('express');
const cors = require('cors');
const setupSwagger = require('./swagger');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const tagsRoutes = require('./routes/tags');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const productsController = require('./controllers/products.controller');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/users', usersRoutes);

app.use('/auth', authRoutes);

// Admin-protected resources
app.use('/categories', categoriesRoutes);
app.use('/tags', tagsRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Public self-healing product URL
app.get('/p/:id-:slug', productsController.publicByIdSlug);

// Swagger docs
setupSwagger(app)

// Health routes requeridas


/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica el estado del servidor
 *     responses:
 *       200:
 *         description: Servidor activo
 */
app.get('/ping', (req, res) => res.status(200).end());

/**
 * @swagger
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
      auth: '/auth',
      categories: '/categories',
      tags: '/tags',
      products: '/products',
      product_public: '/p/:id-:slug'
    }
  });
});

// Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

module.exports = app;
