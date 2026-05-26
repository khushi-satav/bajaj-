import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TicketCard from './TicketCard';
import { STATUS_LABELS } from '../utils/statusUtils';

/**
 * KanbanColumn Component
 * Represents a single status column in the Kanban board.
 * Acts as a droppable area for drag-and-drop ticket reordering.
 */
export default function KanbanColumn({ status, tickets }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${status}`,
    data: {
      status,
    },
  });

  const ticketIds = tickets.map((t) => t._id);

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'kanban-column--drag-over' : ''}`}
      id={`column-${status}`}
    >
      <div className="kanban-column__header">
        <div className="kanban-column__title-group">
          <span className={`kanban-column__dot kanban-column__dot--${status}`} />
          <h2 className="kanban-column__title">{STATUS_LABELS[status]}</h2>
        </div>
        <span className="kanban-column__count">{tickets.length}</span>
      </div>

      <div className="kanban-column__cards">
        <SortableContext items={ticketIds} strategy={verticalListSortingStrategy}>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))
          ) : (
            <div className="kanban-column__empty">
              No tickets
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
