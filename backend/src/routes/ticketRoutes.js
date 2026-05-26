const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getStats,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const {
  validateCreateTicket,
  handleValidationErrors,
} = require('../middleware/validateTicket');

/**
 * Ticket Routes
 *
 * IMPORTANT: /stats must come BEFORE /:id to avoid
 * Express treating "stats" as a ticket ID parameter.
 */

// GET /api/tickets/stats - Dashboard statistics
router.get('/stats', getStats);

// GET /api/tickets - List all tickets (with optional filters)
router.get('/', getTickets);

// POST /api/tickets - Create a new ticket
router.post('/', validateCreateTicket, handleValidationErrors, createTicket);

// PATCH /api/tickets/:id - Update ticket status
router.patch('/:id', updateTicket);

// DELETE /api/tickets/:id - Delete a ticket
router.delete('/:id', deleteTicket);

module.exports = router;
