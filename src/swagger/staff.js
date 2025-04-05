/**
 * @swagger
 * components:
 *   schemas:
 *     StaffMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The staff member ID
 *         firstName:
 *           type: string
 *           description: First name
 *         lastName:
 *           type: string
 *           description: Last name
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         phone:
 *           type: string
 *           description: Phone number
 *         specialization:
 *           type: string
 *           description: Staff specialization (e.g., Hair Stylist)
 *         imageUrl:
 *           type: string
 *           description: URL to staff image
 *         bio:
 *           type: string
 *           description: Staff bio/description
 *       example:
 *         id: 'staff123'
 *         firstName: 'Jane'
 *         lastName: 'Smith'
 *         email: 'jane@salon.com'
 *         phone: '1234567890'
 *         specialization: 'Senior Hair Stylist'
 *         imageUrl: 'https://example.com/images/jane.jpg'
 *         bio: 'Jane has over 10 years of experience in hair styling.'
 *
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff member management
 *
 * @swagger
 * /api/staff/salon/{salonId}:
 *   get:
 *     summary: Get all staff members for a salon
 *     tags: [Staff]
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
 *         description: List of all staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffMember'
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/staff/{staffId}:
 *   get:
 *     summary: Get staff member by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         schema:
 *           type: string
 *         required: true
 *         description: Staff ID
 *     security: []
 *     responses:
 *       200:
 *         description: Staff member details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffMember'
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Server error
 */
