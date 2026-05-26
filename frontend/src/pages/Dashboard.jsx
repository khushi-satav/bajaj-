import StatsStrip from '../components/StatsStrip';
import FilterBar from '../components/FilterBar';
import KanbanBoard from '../components/KanbanBoard';
import CreateTicketForm from '../components/CreateTicketForm';
import { useTickets } from '../hooks/useTickets';

/**
 * Dashboard Page
 * Main page composing all dashboard sections:
 * - Stats strip
 * - Filter bar
 * - Kanban board
 * - Create ticket modal
 */
export default function Dashboard() {
  const { showCreateForm, error, fetchTickets, fetchStats } = useTickets();

  return (
    <>
      {/* Stats */}
      <StatsStrip />

      {/* Filters */}
      <FilterBar />

      {/* Error State */}
      {error && (
        <div className="error-state">
          <div className="error-state__icon">😵</div>
          <p className="error-state__message">{error}</p>
          <button
            className="btn btn--secondary"
            onClick={() => {
              fetchTickets();
              fetchStats();
            }}
          >
            ↻ Try Again
          </button>
        </div>
      )}

      {/* Kanban Board */}
      {!error && <KanbanBoard />}

      {/* Create Ticket Modal */}
      {showCreateForm && <CreateTicketForm />}
    </>
  );
}
