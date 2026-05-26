// Load .env only in local development (Vercel injects env vars directly)
if (!process.env.VERCEL) {
  require('dotenv').config();
}

const app = require('../src/app');
const connectDB = require('../src/config/db');

/**
 * Serverless Entry Point for Vercel
 *
 * This file serves as both:
 * 1. The Vercel serverless function handler
 * 2. The local development server entry point
 *
 * On Vercel, this module exports the Express app directly.
 * Locally, it starts a traditional HTTP server.
 */

// Connect to MongoDB before handling requests
let isDbConnected = false;

const initDB = async () => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
};

// Wrap app with DB connection for serverless (with error handling)
const handler = async (req, res) => {
  try {
    await initDB();
    return app(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message,
    });
  }
};

// Local development server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 DeskFlow API running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  });
}

module.exports = handler;
