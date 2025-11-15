const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List categories (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Categories
 *     responses:
 *       200:
 *         description: Lista de categorías
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
 *                     $ref: '#/components/schemas/Category'
 *
 *   post:
 *     summary: Create a new category (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *
 * /categories/{id}:
 *   get:
 *     summary: Get category by id (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *
 *   put:
 *     summary: Update category (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *
 *   delete:
 *     summary: Delete category (protected)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Admin - Categories
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
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
 *                       example: Category deleted
 */


router.get("/", auth, controller.listCategories);
router.get("/:id", auth, controller.getCategory);
router.post("/", auth, controller.createCategory);
router.put("/:id", auth, controller.updateCategory);
router.delete("/:id", auth, controller.deleteCategory);

module.exports = router;
