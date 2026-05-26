require('dotenv').config();
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

// Wrap app with DB connection for serverless
const handler = async (req, res) => {
  await initDB();
  return app(req, res);
};

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 DeskFlow API running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  });
}

module.exports = handler;
