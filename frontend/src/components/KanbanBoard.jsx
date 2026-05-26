import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { useTickets } from '../hooks/useTickets';
import { COLUMN_ORDER, isValidTransition } from '../utils/statusUtils';
import toast from 'react-hot-toast';

/**
 * KanbanBoard Component
 * Renders the 4-column Kanban board with drag-and-drop support.
 * Validates status transitions on drop and shows errors for invalid moves.
 */
export default function KanbanBoard() {
  const { ticketsByStatus, updateTicketStatus, loading } = useTickets();
  const [activeId, setActiveId] = useState(null);

  // Configure pointer sensor with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    })
  );

  // Find the ticket being dragged
  const activeTicket = activeId
    ? Object.values(ticketsByStatus)
        .flat()
        .find((t) => t._id === activeId)
    : null;

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      // Determine target column from the droppable ID
      const overId = over.id.toString();
      let targetStatus;

      if (overId.startsWith('column-')) {
        targetStatus = overId.replace('column-', '');
      } else {
        // Dropped on another ticket - find which column it belongs to
        const targetTicket = Object.values(ticketsByStatus)
          .flat()
          .find((t) => t._id === overId);
        if (targetTicket) {
          targetStatus = targetTicket.status;
        }
      }

      if (!targetStatus) return;

      const draggedTicket = active.data?.current?.ticket;
      if (!draggedTicket) return;

      // No-op if dropped in same column
      if (draggedTicket.status === targetStatus) return;

      // Validate transition
      if (!isValidTransition(draggedTicket.status, targetStatus)) {
        toast.error(`Invalid transition: cannot move from "${draggedTicket.status}" to "${targetStatus}"`);
        return;
      }

      // Attempt status change
      try {
        await updateTicketStatus(draggedTicket._id, targetStatus);
      } catch {
        // Error toast is already handled in context
      }
    },
    [ticketsByStatus, updateTicketStatus]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  if (loading.tickets && Object.values(ticketsByStatus).every((arr) => arr.length === 0)) {
    return (
      <div className="loader loader--full">
        <div className="loader__spinner" />
        <span>Loading tickets...</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="kanban-board" id="kanban-board">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={ticketsByStatus[status] || []}
          />
        ))}
      </div>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeTicket ? (
          <div
            className="ticket-card"
            style={{
              transform: 'rotate(3deg)',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
              cursor: 'grabbing',
              maxWidth: '300px',
            }}
          >
            <div className="ticket-card__header">
              <span className="ticket-card__subject">{activeTicket.subject}</span>
              <span className={`ticket-card__priority ticket-card__priority--${activeTicket.priority}`}>
                {activeTicket.priority}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
