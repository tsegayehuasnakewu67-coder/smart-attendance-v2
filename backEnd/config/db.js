const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_attendance');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`❌ MongoDB Error: ${err.message}`);
      process.exit(1);
    }

    console.warn('⚠️ MongoDB not reachable, starting in-memory MongoDB fallback...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        binary: { version: '7.0.14' },
        instance: { dbName: 'smart_attendance' },
      });

      const conn = await mongoose.connect(mongoMemoryServer.getUri('smart_attendance'));
      console.log(`✅ In-memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memoryErr) {
      console.error(`❌ In-memory MongoDB fallback failed: ${memoryErr.message}`);
      process.exit(1);
    }
  }
};

process.on('SIGINT', async () => {
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
  process.exit(0);
});

module.exports = connectDB;
