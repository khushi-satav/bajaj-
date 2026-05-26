const ticketService = require('../services/ticketService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS } = require('../constants');

/**
 * Ticket Controller
 * Thin controller layer - delegates business logic to TicketService.
 * Handles HTTP request/response concerns only.
 */

/**
 * POST /api/tickets
 * Create a new support ticket.
 */
const createTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createTicket(req.body);
  const response = new ApiResponse(HTTP_STATUS.CREATED, ticket, 'Ticket created successfully');
  res.status(HTTP_STATUS.CREATED).json(response);
});

/**
 * GET /api/tickets
 * Retrieve all tickets with optional filters.
 * Query params: status, priority, breached
 */
const getTickets = asyncHandler(async (req, res) => {
  const { status, priority, breached } = req.query;
  const tickets = await ticketService.getTickets({ status, priority, breached });
  const response = new ApiResponse(HTTP_STATUS.OK, tickets, 'Tickets retrieved successfully');
  res.status(HTTP_STATUS.OK).json(response);
});

/**
 * GET /api/tickets/stats
 * Retrieve aggregate dashboard statistics.
 */
const getStats = asyncHandler(async (req, res) => {
  const stats = await ticketService.getStats();
  const response = new ApiResponse(HTTP_STATUS.OK, stats, 'Stats retrieved successfully');
  res.status(HTTP_STATUS.OK).json(response);
});

/**
 * PATCH /api/tickets/:id
 * Update ticket status with transition validation.
 */
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateTicketStatus(req.params.id, req.body);
  const response = new ApiResponse(HTTP_STATUS.OK, ticket, 'Ticket updated successfully');
  res.status(HTTP_STATUS.OK).json(response);
});

/**
 * DELETE /api/tickets/:id
 * Delete a ticket permanently.
 */
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.deleteTicket(req.params.id);
  const response = new ApiResponse(HTTP_STATUS.OK, ticket, 'Ticket deleted successfully');
  res.status(HTTP_STATUS.OK).json(response);
});

module.exports = {
  createTicket,
  getTickets,
  getStats,
  updateTicket,
  deleteTicket,
};
