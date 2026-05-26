import api from './api';

/**
 * Ticket Service
 * All API calls related to tickets are centralized here.
 */
const ticketService = {
  /**
   * Fetch all tickets with optional filters.
   * @param {Object} filters - { status, priority, breached }
   */
  getTickets: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.breached) params.append('breached', 'true');

    const queryString = params.toString();
    const url = queryString ? `/tickets?${queryString}` : '/tickets';
    return api.get(url);
  },

  /**
   * Fetch dashboard statistics.
   */
  getStats: async () => {
    return api.get('/tickets/stats');
  },

  /**
   * Create a new ticket.
   * @param {Object} ticketData - { subject, description, customerEmail, priority }
   */
  createTicket: async (ticketData) => {
    return api.post('/tickets', ticketData);
  },

  /**
   * Update a ticket's status.
   * @param {string} id - Ticket ID
   * @param {string} status - New status
   */
  updateTicketStatus: async (id, status) => {
    return api.patch(`/tickets/${id}`, { status });
  },

  /**
   * Delete a ticket.
   * @param {string} id - Ticket ID
   */
  deleteTicket: async (id) => {
    return api.delete(`/tickets/${id}`);
  },
};

export default ticketService;
