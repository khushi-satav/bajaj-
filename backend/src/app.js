const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./routes/ticketRoutes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Express Application Setup
 * Configures middleware, routes, and error handling.
 */
const app = express();

// ── CORS Configuration ──
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter(Boolean);

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for Vercel deployment flexibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ── Body Parsers ──
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// ── Root API Route ──
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to DeskFlow API',
    endpoints: {
      health: '/api/health',
      tickets: '/api/tickets',
      stats: '/api/tickets/stats',
    },
  });
});

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DeskFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──
app.use('/api/tickets', ticketRoutes);

// ── 404 Handler ──
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Centralized Error Handler (must be last) ──
app.use(errorHandler);

module.exports = app;
