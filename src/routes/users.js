const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middleware/auth.middleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Devuelve una lista de todos los usuarios registrados.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Tomas Briceño
 */
router.get('/', auth, usersController.listUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by id (protected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: User object
 */
router.get('/:id', auth, usersController.getUser);

router.post('/', auth, usersController.createUser);
router.put('/:id', auth, usersController.updateUser);
router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;
