const express = require('express');
const router = express.Router();
const controller = require('../controllers/orders.controller');
const auth = require('../middleware/auth.middleware');

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create order and process payment (protected, transactional)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *               - paymentDetails
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               paymentMethod:
 *                 type: string
 *               paymentDetails:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created
 * /orders:
 *   get:
 *     summary: List authenticated user's orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated orders
 * /orders/{id}:
 *   get:
 *     summary: Get order detail (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order detail
 */

router.post('/', auth, controller.createOrder);
router.get('/', auth, controller.listOrders);
router.get('/:id', auth, controller.getOrder);

module.exports = router;
