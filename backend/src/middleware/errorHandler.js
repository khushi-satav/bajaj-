const ApiError = require('../utils/ApiError');

/**
 * Centralized error handling middleware.
 * Catches all errors thrown or passed via next() and returns
 * a structured JSON error response.
 *
 * Handles:
 * - Custom ApiError instances
 * - Mongoose validation errors
 * - Mongoose CastError (invalid ObjectId)
 * - Unexpected errors
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error (field-level validation failures)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // Mongoose CastError (e.g., invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value for field: ${field}`;
  }

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
