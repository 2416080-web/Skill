const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  // 1. If explicit URI is provided (e.g. MongoDB Atlas)
  if (uri && uri.trim() !== '' && !uri.includes('your_mongodb_atlas')) {
    try {
      console.log('Connecting to MongoDB Atlas / Remote database...');
      const conn = await mongoose.connect(uri);
      console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`! Failed to connect to configured MONGODB_URI: ${err.message}`);
      console.log('Attempting in-memory database fallback for seamless development...');
    }
  }

  // 2. Fallback to MongoMemoryServer for immediate zero-config local run
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('Starting in-memory MongoDB server for instant setup...');
    memoryServer = await MongoMemoryServer.create();
    const fallbackUri = memoryServer.getUri();
    const conn = await mongoose.connect(fallbackUri);
    console.log(`✓ In-Memory MongoDB Started & Connected: ${conn.connection.host}`);
    console.log('NOTE: To persist data across server restarts, add your MongoDB Atlas URI in server/.env');
    return conn;
  } catch (memErr) {
    // 3. Fallback to default local mongo if available
    try {
      const defaultLocalUri = 'mongodb://127.0.0.1:27017/skillproof';
      console.log('Trying local MongoDB instance at mongodb://127.0.0.1:27017/skillproof ...');
      const conn = await mongoose.connect(defaultLocalUri);
      console.log(`✓ Local MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      console.error('✗ MongoDB Connection Error:', localErr.message);
      console.error('Please configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
      throw localErr;
    }
  }
};

module.exports = connectDB;
