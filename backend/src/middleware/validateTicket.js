const { body, validationResult } = require('express-validator');
const { TICKET_PRIORITY } = require('../constants');

/**
 * Validation rules for creating a new ticket.
 * Uses express-validator for declarative validation.
 */
const validateCreateTicket = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('customerEmail')
    .trim()
    .notEmpty()
    .withMessage('Customer email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(Object.values(TICKET_PRIORITY))
    .withMessage(
      `Priority must be one of: ${Object.values(TICKET_PRIORITY).join(', ')}`
    ),
];

/**
 * Middleware to check validation results and return 400 on failure.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join('. ');
    return res.status(400).json({
      success: false,
      message,
    });
  }
  next();
};

module.exports = {
  validateCreateTicket,
  handleValidationErrors,
};
