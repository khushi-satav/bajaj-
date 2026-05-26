import { useTicketContext } from '../context/TicketContext';

/**
 * Custom hook to access ticket state and operations.
 * Provides a clean interface for components to consume ticket data.
 */
export function useTickets() {
  return useTicketContext();
}

export default useTickets;
