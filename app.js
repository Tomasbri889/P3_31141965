var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const nombreCompleto = "Tomas Moisés Briceño Mayorca";
const cedula = "31141965";
const seccion = "1";



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);





app.get('/about', (req, res) => {
  res.json({
    status: "success",
    data: {
      nombreCompleto,
      cedula,
      seccion,
    }
  });
});

app.get('/ping', (req, res) => {
  res.status(200).send();
});





const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API P3_31141965',
    version: '1.0.0',
    description: 'Documentación de la API RESTful para P3_CEDULA',
  },
  servers: [
    
      { url: 'https://p3-31141965-2.onrender.com', description: 'Servidor en Render' },
    { url: 'http://localhost:3000', description: 'Servidor local' },
    
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./app.js'], // Aquí leerá los JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Endpoint para verificar que la API está activa
 *     responses:
 *       200:
 *         description: Respuesta vacía con estado 200 OK
 *
 * /about:
 *   get:
 *     summary: Devuelve información personal en formato JSend
 *     responses:
 *       200:
 *         description: Información personal en formato JSend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                       example: Tomas Moisés Briceño Mayorca
 *                     cedula:
 *                       type: string
 *                       example: 3114196
 *                     seccion:
 *                       type: string
 *                       example: 1
 */







module.exports = app;
