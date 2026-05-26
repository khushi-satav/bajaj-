const mongoose = require('mongoose');
const { TICKET_STATUS, TICKET_PRIORITY } = require('../constants');

/**
 * Ticket Schema
 * 
 * Note: ageMinutes and slaBreached are NOT stored in the database.
 * They are computed dynamically in the service layer on every API response.
 */
const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: Object.values(TICKET_PRIORITY),
        message: 'Priority must be one of: low, medium, high, urgent',
      },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TICKET_STATUS),
        message: 'Status must be one of: open, in_progress, resolved, closed',
      },
      default: TICKET_STATUS.OPEN,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for common query patterns
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
