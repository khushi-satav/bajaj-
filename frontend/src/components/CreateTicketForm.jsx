import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';

/**
 * CreateTicketForm Component
 * Modal form for creating new support tickets.
 * Features inline validation and loading states.
 */
export default function CreateTicketForm() {
  const { createTicket, loading, setShowCreateForm } = useTickets();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: '',
  });

  const [errors, setErrors] = useState({});

  // ── Validation ──
  const validateField = (name, value) => {
    switch (name) {
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.length > 200) return 'Subject cannot exceed 200 characters';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length > 2000) return 'Description cannot exceed 2000 characters';
        return '';
      case 'customerEmail':
        if (!value.trim()) return 'Customer email is required';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'priority':
        if (!value) return 'Priority is required';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createTicket(formData);
    } catch {
      // Error is handled by context (toast)
    }
  };

  const handleClose = () => {
    setShowCreateForm(false);
  };

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="create-ticket-modal">
      <div className="modal-content">
        <div className="modal-content__header">
          <h2 className="modal-content__title">Create New Ticket</h2>
          <button
            className="modal-content__close"
            onClick={handleClose}
            type="button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Subject */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="ticket-subject">
              Subject
            </label>
            <input
              type="text"
              id="ticket-subject"
              name="subject"
              className={`form-group__input ${errors.subject ? 'form-group__input--error' : ''}`}
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Brief summary of the issue"
              maxLength={200}
            />
            {errors.subject && (
              <span className="form-group__error">⚠ {errors.subject}</span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="ticket-description">
              Description
            </label>
            <textarea
              id="ticket-description"
              name="description"
              className={`form-group__textarea ${errors.description ? 'form-group__textarea--error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Detailed description of the problem"
              maxLength={2000}
            />
            {errors.description && (
              <span className="form-group__error">⚠ {errors.description}</span>
            )}
          </div>

          {/* Customer Email */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="ticket-email">
              Customer Email
            </label>
            <input
              type="email"
              id="ticket-email"
              name="customerEmail"
              className={`form-group__input ${errors.customerEmail ? 'form-group__input--error' : ''}`}
              value={formData.customerEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="customer@example.com"
            />
            {errors.customerEmail && (
              <span className="form-group__error">⚠ {errors.customerEmail}</span>
            )}
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="ticket-priority">
              Priority
            </label>
            <select
              id="ticket-priority"
              name="priority"
              className={`form-group__select ${errors.priority ? 'form-group__select--error' : ''}`}
              value={formData.priority}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select priority...</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {errors.priority && (
              <span className="form-group__error">⚠ {errors.priority}</span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={loading.creating}
              id="submit-ticket-btn"
            >
              {loading.creating ? (
                <>
                  <div className="loader__spinner loader__spinner--sm" />
                  Creating...
                </>
              ) : (
                '+ Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
