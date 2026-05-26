const { STATUS_TRANSITIONS } = require('../constants');

/**
 * Validates whether a status transition is allowed.
 *
 * @param {string} currentStatus - The current ticket status
 * @param {string} newStatus - The desired new status
 * @returns {boolean} Whether the transition is valid
 */
const isValidTransition = (currentStatus, newStatus) => {
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
  if (!allowedTransitions) return false;
  return allowedTransitions.includes(newStatus);
};

module.exports = { isValidTransition };
