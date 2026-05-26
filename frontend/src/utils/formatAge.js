/**
 * Format age in minutes to human-readable string.
 *
 * Examples:
 *   5 -> "5m"
 *   130 -> "2h 10m"
 *   1500 -> "1d 1h"
 *
 * @param {number} minutes - Age in minutes
 * @returns {string} Formatted age string
 */
export const formatAge = (minutes) => {
  if (minutes < 0) return '0m';

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.round(minutes % 60);

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
};

/**
 * Get SLA target text for a given priority.
 *
 * @param {string} priority - Ticket priority
 * @returns {string} SLA target description
 */
export const getSlaTargetText = (priority) => {
  const targets = {
    urgent: '1h',
    high: '4h',
    medium: '24h',
    low: '72h',
  };
  return targets[priority] || 'N/A';
};
