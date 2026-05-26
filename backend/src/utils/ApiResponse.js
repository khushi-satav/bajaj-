/**
 * Standardized API response wrapper.
 * Ensures all successful responses follow a consistent structure.
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
