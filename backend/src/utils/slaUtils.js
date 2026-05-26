const { SLA_TARGETS_MINUTES, TICKET_STATUS } = require('../constants');

/**
 * Compute the age of a ticket in minutes.
 *
 * - If unresolved: currentTime - createdAt
 * - If resolved/closed with resolvedAt: resolvedAt - createdAt
 *
 * @param {Date} createdAt - Ticket creation timestamp
 * @param {Date|null} resolvedAt - Ticket resolution timestamp (nullable)
 * @param {string} status - Current ticket status
 * @returns {number} Age in minutes (rounded to nearest integer)
 */
const computeAgeMinutes = (createdAt, resolvedAt, status) => {
  const created = new Date(createdAt).getTime();
  let endTime;

  if (
    resolvedAt &&
    (status === TICKET_STATUS.RESOLVED || status === TICKET_STATUS.CLOSED)
  ) {
    endTime = new Date(resolvedAt).getTime();
  } else {
    endTime = Date.now();
  }

  return Math.round((endTime - created) / (1000 * 60));
};

/**
 * Determine if a ticket has breached its SLA target.
 *
 * Breached when:
 * - Unresolved and age exceeds SLA target
 * - Resolved but took longer than SLA target
 *
 * @param {string} priority - Ticket priority level
 * @param {number} ageMinutes - Computed age in minutes
 * @returns {boolean} Whether the SLA has been breached
 */
const isSlaBreached = (priority, ageMinutes) => {
  const target = SLA_TARGETS_MINUTES[priority];
  if (!target) return false;
  return ageMinutes > target;
};

/**
 * Get the SLA target in minutes for a given priority.
 *
 * @param {string} priority - Ticket priority level
 * @returns {number} SLA target in minutes
 */
const getSlaTarget = (priority) => {
  return SLA_TARGETS_MINUTES[priority] || 0;
};

/**
 * Enrich a single ticket document with computed derived fields.
 *
 * @param {Object} ticket - Mongoose ticket document (lean or toObject)
 * @returns {Object} Ticket with ageMinutes and slaBreached appended
 */
const enrichTicketWithDerivedFields = (ticket) => {
  const ticketObj = ticket.toObject ? ticket.toObject() : { ...ticket };
  const ageMinutes = computeAgeMinutes(
    ticketObj.createdAt,
    ticketObj.resolvedAt,
    ticketObj.status
  );
  const slaBreached = isSlaBreached(ticketObj.priority, ageMinutes);

  return {
    ...ticketObj,
    ageMinutes,
    slaBreached,
  };
};

/**
 * Enrich an array of ticket documents with derived fields.
 *
 * @param {Array} tickets - Array of ticket documents
 * @returns {Array} Tickets with ageMinutes and slaBreached appended
 */
const enrichTicketsWithDerivedFields = (tickets) => {
  return tickets.map(enrichTicketWithDerivedFields);
};

module.exports = {
  computeAgeMinutes,
  isSlaBreached,
  getSlaTarget,
  enrichTicketWithDerivedFields,
  enrichTicketsWithDerivedFields,
};
