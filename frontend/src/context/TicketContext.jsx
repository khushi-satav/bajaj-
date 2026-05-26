import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ticketService from '../services/ticketService';
import toast from 'react-hot-toast';

const TicketContext = createContext(null);

/**
 * TicketProvider
 * Global state management for tickets, stats, filters, and loading states.
 */
export function TicketProvider({ children }) {
  // ── State ──
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ priority: '', breached: false });
  const [loading, setLoading] = useState({ tickets: false, creating: false, updating: {} });
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ── Fetch Tickets ──
  const fetchTickets = useCallback(async () => {
    setLoading((prev) => ({ ...prev, tickets: true }));
    setError(null);
    try {
      const filterParams = {};
      if (filters.priority) filterParams.priority = filters.priority;
      if (filters.breached) filterParams.breached = true;

      const response = await ticketService.getTickets(filterParams);
      setTickets(response.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading((prev) => ({ ...prev, tickets: false }));
    }
  }, [filters]);

  // ── Fetch Stats ──
  const fetchStats = useCallback(async () => {
    try {
      const response = await ticketService.getStats();
      setStats(response.data || null);
    } catch (err) {
      console.error('Failed to fetch stats:', err.message);
    }
  }, []);

  // ── Create Ticket ──
  const createTicket = useCallback(async (ticketData) => {
    setLoading((prev) => ({ ...prev, creating: true }));
    try {
      await ticketService.createTicket(ticketData);
      toast.success('Ticket created successfully!');
      setShowCreateForm(false);
      // Refresh data
      await Promise.all([fetchTickets(), fetchStats()]);
    } catch (err) {
      toast.error(err.message || 'Failed to create ticket');
      throw err; // Re-throw so form can handle it
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  }, [fetchTickets, fetchStats]);

  // ── Update Ticket Status ──
  const updateTicketStatus = useCallback(async (id, newStatus) => {
    setLoading((prev) => ({
      ...prev,
      updating: { ...prev.updating, [id]: true },
    }));
    try {
      await ticketService.updateTicketStatus(id, newStatus);
      toast.success('Status updated!');
      // Refresh data
      await Promise.all([fetchTickets(), fetchStats()]);
    } catch (err) {
      toast.error(err.message || 'Failed to update ticket');
      throw err; // Re-throw for drag-and-drop error handling
    } finally {
      setLoading((prev) => ({
        ...prev,
        updating: { ...prev.updating, [id]: false },
      }));
    }
  }, [fetchTickets, fetchStats]);

  // ── Delete Ticket ──
  const deleteTicket = useCallback(async (id) => {
    setLoading((prev) => ({
      ...prev,
      updating: { ...prev.updating, [id]: true },
    }));
    try {
      await ticketService.deleteTicket(id);
      toast.success('Ticket deleted');
      await Promise.all([fetchTickets(), fetchStats()]);
    } catch (err) {
      toast.error(err.message || 'Failed to delete ticket');
    } finally {
      setLoading((prev) => ({
        ...prev,
        updating: { ...prev.updating, [id]: false },
      }));
    }
  }, [fetchTickets, fetchStats]);

  // ── Initial Data Load ──
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [fetchTickets, fetchStats]);

  // ── Group Tickets by Status for Kanban ──
  const ticketsByStatus = {
    open: tickets.filter((t) => t.status === 'open'),
    in_progress: tickets.filter((t) => t.status === 'in_progress'),
    resolved: tickets.filter((t) => t.status === 'resolved'),
    closed: tickets.filter((t) => t.status === 'closed'),
  };

  const value = {
    tickets,
    ticketsByStatus,
    stats,
    filters,
    setFilters,
    loading,
    error,
    showCreateForm,
    setShowCreateForm,
    fetchTickets,
    fetchStats,
    createTicket,
    updateTicketStatus,
    deleteTicket,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}

/**
 * Custom hook to access ticket context.
 * Throws if used outside TicketProvider.
 */
export function useTicketContext() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketContext must be used within a TicketProvider');
  }
  return context;
}

export default TicketContext;
