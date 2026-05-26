/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express error middleware.
 * Eliminates the need for try-catch in every controller.
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
