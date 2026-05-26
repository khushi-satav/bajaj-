/**
 * Status transition rules (mirrors backend constants).
 * Used to render only valid action buttons on each ticket card.
 */
export const STATUS_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved'],
};

/**
 * Human-readable labels for status values.
 */
export const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

/**
 * Kanban column order.
 */
export const COLUMN_ORDER = ['open', 'in_progress', 'resolved', 'closed'];

/**
 * Check if a status transition is valid.
 *
 * @param {string} from - Current status
 * @param {string} to - Target status
 * @returns {boolean}
 */
export const isValidTransition = (from, to) => {
  return STATUS_TRANSITIONS[from]?.includes(to) || false;
};

/**
 * Determine if a transition is forward or backward.
 *
 * @param {string} from - Current status
 * @param {string} to - Target status
 * @returns {'forward' | 'backward'}
 */
export const getTransitionDirection = (from, to) => {
  const order = COLUMN_ORDER;
  return order.indexOf(to) > order.indexOf(from) ? 'forward' : 'backward';
};

/**
 * Get action label for a status transition.
 *
 * @param {string} targetStatus - Status to move to
 * @param {string} direction - 'forward' or 'backward'
 * @returns {string}
 */
export const getActionLabel = (targetStatus, direction) => {
  const prefix = direction === 'backward' ? 'Back to' : 'Move to';
  return `${prefix} ${STATUS_LABELS[targetStatus]}`;
};
