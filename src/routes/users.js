const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middleware/auth.middleware');

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users (protected)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth, usersController.listUsers);

/**
 * @openapi
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
