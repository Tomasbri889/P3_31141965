const express = require('express');
const router = express.Router();
const controller = require('../controllers/tags.controller');
const auth = require('../middleware/auth.middleware');

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: List tags (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Tags
 *     responses:
 *       200:
 *         description: Lista de tags
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
 *                     $ref: '#/components/schemas/Tag'
 *   post:
 *     summary: Create a new tag (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 *
 * /tags/{id}:
 *   get:
 *     summary: Get tag by id (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Tags
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Tag object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 *   put:
 *     summary: Update tag (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Tags
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Tag updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Tag'
 *   delete:
 *     summary: Delete tag (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Tags
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Tag deleted
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
 *                     message:
 *                       type: string
 *                       example: Tag deleted
 */

router.get('/', auth, controller.listTags);
router.get('/:id', auth, controller.getTag);
router.post('/', auth, controller.createTag);
router.put('/:id', auth, controller.updateTag);
router.delete('/:id', auth, controller.deleteTag);

module.exports = router;
