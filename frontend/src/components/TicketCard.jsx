import { formatAge } from '../utils/formatAge';
import {
  STATUS_TRANSITIONS,
  STATUS_LABELS,
  getTransitionDirection,
  getActionLabel,
} from '../utils/statusUtils';
import { useTickets } from '../hooks/useTickets';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * TicketCard Component
 * Renders a single ticket card with:
 * - Subject, priority badge, age, SLA indicator
 * - Valid status action buttons
 * - Drag-and-drop support via dnd-kit
 */
export default function TicketCard({ ticket }) {
  const { updateTicketStatus, deleteTicket, loading } = useTickets();
  const isUpdating = loading.updating[ticket._id];

  // dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket._id,
    data: {
      ticket,
      status: ticket.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get valid transitions for this ticket's current status
  const validTransitions = STATUS_TRANSITIONS[ticket.status] || [];

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatus(ticket._id, newStatus);
    } catch {
      // Error toast is already handled in context
    }
  };

  const handleDelete = async () => {
    await deleteTicket(ticket._id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`ticket-card ${isDragging ? 'ticket-card--dragging' : ''}`}
      id={`ticket-${ticket._id}`}
    >
      {/* Header: Subject + Priority */}
      <div className="ticket-card__header">
        <span className="ticket-card__subject">{ticket.subject}</span>
        <span className={`ticket-card__priority ticket-card__priority--${ticket.priority}`}>
          {ticket.priority}
        </span>
      </div>

      {/* Meta: Age + SLA */}
      <div className="ticket-card__meta">
        <span className="ticket-card__age">
          🕐 {formatAge(ticket.ageMinutes)}
        </span>
        {ticket.slaBreached ? (
          <span className="ticket-card__sla-badge ticket-card__sla-badge--breached">
            ⚠ SLA Breached
          </span>
        ) : (
          <span className="ticket-card__sla-badge ticket-card__sla-badge--ok">
            ✓ Within SLA
          </span>
        )}
      </div>

      {/* Email */}
      <div className="ticket-card__email" title={ticket.customerEmail}>
        ✉ {ticket.customerEmail}
      </div>

      {/* Actions */}
      <div className="ticket-card__actions">
        {validTransitions.map((targetStatus) => {
          const direction = getTransitionDirection(ticket.status, targetStatus);
          const label = getActionLabel(targetStatus, direction);
          return (
            <button
              key={targetStatus}
              className={`ticket-card__action-btn ticket-card__action-btn--${direction}`}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(targetStatus);
              }}
              disabled={isUpdating}
              title={label}
            >
              {direction === 'forward' ? '→' : '←'} {STATUS_LABELS[targetStatus]}
            </button>
          );
        })}
        <button
          className="ticket-card__action-btn ticket-card__action-btn--delete"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isUpdating}
          title="Delete ticket"
        >
          ✕
        </button>
      </div>

      {/* Loading overlay */}
      {isUpdating && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 11, 15, 0.6)',
            borderRadius: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="loader__spinner loader__spinner--sm" />
        </div>
      )}
    </div>
  );
}
