/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The category ID
 *         name:
 *           type: string
 *           description: The category name
 *         description:
 *           type: string
 *           description: Category description
 *         imageUrl:
 *           type: string
 *           description: URL to category image
 *       example:
 *         id: 'haircuts'
 *         name: 'Haircuts'
 *         description: 'Professional hair cutting services'
 *         imageUrl: 'https://example.com/images/haircuts.jpg'
 *
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The service ID
 *         categoryId:
 *           type: string
 *           description: The ID of the category this service belongs to
 *         name:
 *           type: string
 *           description: The service name
 *         description:
 *           type: string
 *           description: Service description
 *         price:
 *           type: number
 *           description: Service price
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         imageUrl:
 *           type: string
 *           description: URL to service image
 *       example:
 *         id: 'mens-haircut'
 *         categoryId: 'haircuts'
 *         name: "Men's Haircut"
 *         description: 'Professional haircut for men including styling'
 *         price: 35.00
 *         duration: 30
 *         imageUrl: 'https://example.com/images/mens-haircut.jpg'
 *
 * @swagger
 * tags:
 *   name: Services
 *   description: Service and category management
 *
 * @swagger
 * /api/services/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Services]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/services/category/{categoryId}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     security: []
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/services/category/{categoryId}/service/{serviceId}:
 *   get:
 *     summary: Get service by ID within a category
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *       - in: path
 *         name: serviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     security: []
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/services/salon/{salonId}:
 *   get:
 *     summary: Get all services for a salon
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         schema:
 *           type: string
 *         required: true
 *         description: Salon ID
 *     security: []
 *     responses:
 *       200:
 *         description: List of all services for a salon
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
