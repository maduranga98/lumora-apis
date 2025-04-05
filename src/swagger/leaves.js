/**
 * @swagger
 * components:
 *   schemas:
 *     Leave:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The leave ID
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of leave (YYYY-MM-DD)
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of leave (YYYY-MM-DD)
 *         reason:
 *           type: string
 *           description: Reason for leave
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Leave status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Time of leave request creation
 *       example:
 *         id: 'leave123'
 *         startDate: '2025-04-20'
 *         endDate: '2025-04-22'
 *         reason: 'Vacation'
 *         status: 'pending'
 *         createdAt: '2025-04-06T12:00:00Z'
 *
 *     LeaveRequest:
 *       type: object
 *       required:
 *         - staffId
 *         - startDate
 *         - endDate
 *       properties:
 *         staffId:
 *           type: string
 *           description: ID of the staff member
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of leave (YYYY-MM-DD)
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of leave (YYYY-MM-DD)
 *         reason:
 *           type: string
 *           description: Reason for leave
 *       example:
 *         staffId: 'staff123'
 *         startDate: '2025-04-20'
 *         endDate: '2025-04-22'
 *         reason: 'Vacation'
 *
 *     LeaveStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: New status
 *       example:
 *         status: 'approved'
 *
 * @swagger
 * tags:
 *   name: Leaves
 *   description: Staff leave management
 *
 * @swagger
 * /api/leaves/staff/{staffId}:
 *   get:
 *     summary: Get all leaves for a staff member
 *     tags: [Leaves]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         schema:
 *           type: string
 *         required: true
 *         description: Staff ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all leaves
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Leave'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/leaves:
 *   post:
 *     summary: Create a new leave request
 *     tags: [Leaves]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeaveRequest'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Leave'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Staff not found
 *       409:
 *         description: Leave period overlaps
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/leaves/staff/{staffId}/leave/{leaveId}:
 *   patch:
 *     summary: Update leave status
 *     tags: [Leaves]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         schema:
 *           type: string
 *         required: true
 *         description: Staff ID
 *       - in: path
 *         name: leaveId
 *         schema:
 *           type: string
 *         required: true
 *         description: Leave ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeaveStatusUpdate'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Leave not found
 *       500:
 *         description: Server error
 */
