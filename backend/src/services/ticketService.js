const Ticket = require('../models/Ticket');
const ApiError = require('../utils/ApiError');
const { TICKET_STATUS, HTTP_STATUS } = require('../constants');
const { isValidTransition } = require('../utils/transitionUtils');
const {
  enrichTicketWithDerivedFields,
  enrichTicketsWithDerivedFields,
  computeAgeMinutes,
  isSlaBreached,
} = require('../utils/slaUtils');

/**
 * Ticket Service Layer
 * Encapsulates all business logic for ticket operations.
 * Controllers delegate to this service for data operations.
 */
class TicketService {
  /**
   * Create a new ticket with default status 'open'.
   *
   * @param {Object} ticketData - { subject, description, customerEmail, priority }
   * @returns {Object} Created ticket with derived fields
   */
  async createTicket(ticketData) {
    const ticket = await Ticket.create({
      subject: ticketData.subject,
      description: ticketData.description,
      customerEmail: ticketData.customerEmail,
      priority: ticketData.priority,
      status: TICKET_STATUS.OPEN,
    });

    return enrichTicketWithDerivedFields(ticket);
  }

  /**
   * Retrieve all tickets with optional filters.
   * Supports filtering by status, priority, and SLA breach status.
   * Filters are combinable (AND logic).
   *
   * @param {Object} filters - { status, priority, breached }
   * @returns {Array} Filtered tickets with derived fields
   */
  async getTickets(filters = {}) {
    const query = {};

    // Apply status filter
    if (filters.status) {
      const validStatuses = Object.values(TICKET_STATUS);
      if (!validStatuses.includes(filters.status)) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid status filter: ${filters.status}`);
      }
      query.status = filters.status;
    }

    // Apply priority filter
    if (filters.priority) {
      query.priority = filters.priority;
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean();
    let enrichedTickets = enrichTicketsWithDerivedFields(tickets);

    // Apply breached filter (post-query since it's a derived field)
    if (filters.breached === 'true') {
      enrichedTickets = enrichedTickets.filter((t) => t.slaBreached === true);
    }

    return enrichedTickets;
  }

  /**
   * Get a single ticket by ID with derived fields.
   *
   * @param {string} id - Ticket MongoDB ObjectId
   * @returns {Object} Ticket with derived fields
   * @throws {ApiError} 404 if ticket not found
   */
  async getTicketById(id) {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Ticket not found');
    }
    return enrichTicketWithDerivedFields(ticket);
  }

  /**
   * Update a ticket's status with transition validation.
   * Enforces forward/backward transition rules.
   * Manages resolvedAt timestamp automatically.
   *
   * @param {string} id - Ticket MongoDB ObjectId
   * @param {Object} updateData - { status }
   * @returns {Object} Updated ticket with derived fields
   * @throws {ApiError} 400 for invalid transitions, 404 if not found
   */
  async updateTicketStatus(id, updateData) {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Ticket not found');
    }

    const { status: newStatus } = updateData;

    if (!newStatus) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Status is required for update');
    }

    // Validate status transition
    if (!isValidTransition(ticket.status, newStatus)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid status transition'
      );
    }

    // Handle resolvedAt timestamp
    if (newStatus === TICKET_STATUS.RESOLVED) {
      // Moving TO resolved: set resolvedAt
      ticket.resolvedAt = new Date();
    } else if (
      ticket.status === TICKET_STATUS.RESOLVED &&
      newStatus !== TICKET_STATUS.CLOSED
    ) {
      // Moving BACKWARD from resolved: clear resolvedAt
      ticket.resolvedAt = null;
    }

    ticket.status = newStatus;
    await ticket.save();

    return enrichTicketWithDerivedFields(ticket);
  }

  /**
   * Delete a ticket by ID.
   *
   * @param {string} id - Ticket MongoDB ObjectId
   * @returns {Object} Deleted ticket data
   * @throws {ApiError} 404 if ticket not found
   */
  async deleteTicket(id) {
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Ticket not found');
    }
    return enrichTicketWithDerivedFields(ticket);
  }

  /**
   * Compute aggregate statistics for the dashboard.
   *
   * Returns:
   * - statusCounts: count of tickets per status
   * - priorityCounts: count of tickets per priority
   * - currentlyBreached: count of unresolved tickets that have breached SLA
   *
   * @returns {Object} Stats object
   */
  async getStats() {
    const tickets = await Ticket.find({}).lean();

    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    };

    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    let currentlyBreached = 0;

    tickets.forEach((ticket) => {
      // Count by status
      if (statusCounts.hasOwnProperty(ticket.status)) {
        statusCounts[ticket.status]++;
      }

      // Count by priority
      if (priorityCounts.hasOwnProperty(ticket.priority)) {
        priorityCounts[ticket.priority]++;
      }

      // Count breached (only unresolved tickets - open or in_progress)
      if (
        ticket.status === TICKET_STATUS.OPEN ||
        ticket.status === TICKET_STATUS.IN_PROGRESS
      ) {
        const ageMinutes = computeAgeMinutes(
          ticket.createdAt,
          ticket.resolvedAt,
          ticket.status
        );
        if (isSlaBreached(ticket.priority, ageMinutes)) {
          currentlyBreached++;
        }
      }
    });

    return {
      statusCounts,
      priorityCounts,
      currentlyBreached,
    };
  }
}

module.exports = new TicketService();
