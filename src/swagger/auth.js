/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *       properties:
 *         uid:
 *           type: string
 *           description: The auto-generated user ID from Firebase Auth
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *       example:
 *         uid: 'f5WcqEAA4WOcXJDFXxjkl3hj9Xc2'
 *         email: 'john@example.com'
 *         firstName: 'John'
 *         lastName: 'Doe'
 *         phone: '1234567890'
 *         createdAt: '2025-04-06T12:00:00Z'
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - phone
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters)
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 *         phone:
 *           type: string
 *           description: User's phone number
 *       example:
 *         email: 'john@example.com'
 *         password: 'password123'
 *         firstName: 'John'
 *         lastName: 'Doe'
 *         phone: '1234567890'
 *
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 *
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 uid:
 *                   type: string
 *                   example: f5WcqEAA4WOcXJDFXxjkl3hj9Xc2
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Validate user token and get user data
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/auth/user/{uid}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
