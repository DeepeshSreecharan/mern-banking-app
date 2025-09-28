const express = require('express');
const contactController = require('../controllers/contact.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validation.middleware');

const router = express.Router();

// Public route
router.post('/submit', validate(schemas.contact), contactController.submitContact);

// Protected routes
router.get('/my-tickets', authMiddleware, contactController.getUserTickets);
router.get('/ticket/:ticketNumber', contactController.getTicketDetails);

// Admin routes
router.get('/admin/tickets', authMiddleware, adminMiddleware, contactController.getAllTickets);
router.post('/admin/respond', authMiddleware, adminMiddleware, contactController.respondToTicket);
router.put('/admin/ticket/:ticketId/status', authMiddleware, adminMiddleware, contactController.updateTicketStatus);

module.exports = router;