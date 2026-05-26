/**
 * Application-wide constants for DeskFlow
 */

// Ticket status enum values
const TICKET_STATUS = Object.freeze({
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
});

// Ticket priority enum values
const TICKET_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});

// Valid status transitions (forward and backward)
const STATUS_TRANSITIONS = Object.freeze({
  // Forward transitions
  [TICKET_STATUS.OPEN]: [TICKET_STATUS.IN_PROGRESS],
  [TICKET_STATUS.IN_PROGRESS]: [TICKET_STATUS.OPEN, TICKET_STATUS.RESOLVED],
  [TICKET_STATUS.RESOLVED]: [TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.CLOSED],
  [TICKET_STATUS.CLOSED]: [TICKET_STATUS.RESOLVED],
});

// SLA targets in minutes per priority
const SLA_TARGETS_MINUTES = Object.freeze({
  [TICKET_PRIORITY.URGENT]: 60,       // 1 hour
  [TICKET_PRIORITY.HIGH]: 240,        // 4 hours
  [TICKET_PRIORITY.MEDIUM]: 1440,     // 24 hours
  [TICKET_PRIORITY.LOW]: 4320,        // 72 hours
});

// HTTP Status Codes used across the app
const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

module.exports = {
  TICKET_STATUS,
  TICKET_PRIORITY,
  STATUS_TRANSITIONS,
  SLA_TARGETS_MINUTES,
  HTTP_STATUS,
};
