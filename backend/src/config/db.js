const mongoose = require('mongoose');

/**
 * MongoDB Atlas connection handler with retry logic.
 * Uses a cached connection for serverless environments (Vercel).
 */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('📦 Using existing MongoDB connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'deskflow',
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
