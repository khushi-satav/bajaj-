/**
 * Custom API Error class for consistent error handling.
 * Extends native Error with HTTP status code and structured response.
 */
class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // Capture stack trace for debugging (excludes constructor call)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
