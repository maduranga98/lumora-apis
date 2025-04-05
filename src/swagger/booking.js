/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The booking ID
 *         customerId:
 *           type: string
 *           description: ID of the customer
 *         customerName:
 *           type: string
 *           description: Name of the customer
 *         serviceId:
 *           type: string
 *           description: ID of the service booked
 *         date:
 *           type: string
 *           format: date
 *           description: Date of appointment (YYYY-MM-DD)
 *         startTime:
 *           type: string
 *           description: Start time (HH:MM)
 *         endTime:
 *           type: string
 *           description: End time (HH:MM)
 *         status:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *           description: Booking status
 *         notes:
 *           type: string
 *           description: Additional notes
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Time of booking creation
 *       example:
 *         id: 'booking123'
 *         customerId: 'customer456'
 *         customerName: 'John Doe'
 *         serviceId: 'service789'
 *         date: '2025-04-15'
 *         startTime: '14:00'
 *         endTime: '15:00'
 *         status: 'confirmed'
 *         notes: 'First visit'
 *         createdAt: '2025-04-06T12:00:00Z'
 *
 *     BookingRequest:
 *       type: object
 *       required:
 *         - staffId
 *         - customerId
 *         - serviceId
 *         - date
 *         - startTime
 *         - endTime
 *       properties:
 *         staffId:
 *           type: string
 *           description: ID of the staff member
 *         customerId:
 *           type: string
 *           description: ID of the customer
 *         serviceId:
 *           type: string
 *           description: ID of the service
 *         date:
 *           type: string
 *           format: date
 *           description: Date of appointment (YYYY-MM-DD)
 *         startTime:
 *           type: string
 *           description: Start time (HH:MM)
 *         endTime:
 *           type: string
 *           description: End time (HH:MM)
 *         notes:
 *           type: string
 *           description: Additional notes
 *       example:
 *         staffId: 'staff123'
 *         customerId: 'customer456'
 *         serviceId: 'service789'
 *         date: '2025-04-15'
 *         startTime: '14:00'
 *         endTime: '15:00'
 *         notes: 'First time visit'
 *
 *     StatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *           description: New status
 *       example:
 *         status: 'completed'
 *
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 *
 * @swagger
 * /api/booking/staff/{staffId}:
 *   get:
 *     summary: Get all bookings for a staff member
 *     tags: [Bookings]
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
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingRequest'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Staff or customer not found
 *       409:
 *         description: Booking time conflicts
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/booking/staff/{staffId}/booking/{bookingId}:
 *   patch:
 *     summary: Update booking status
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         schema:
 *           type: string
 *         required: true
 *         description: Staff ID
 *       - in: path
 *         name: bookingId
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdate'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
