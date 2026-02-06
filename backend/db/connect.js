require('dotenv').config()
const mongoose = require('mongoose')

const connectionOptions = {
  heartbeatFrequencyMS: 10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

const connectDB = (url) => {
  console.log('Connecting to MongoDB Atlas...');
  return mongoose.connect(url, connectionOptions)
}

const db = mongoose.connection;
db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
db.on('connected', () => {
  console.log('✅ MongoDB Atlas connected successfully.');
});
db.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Mongoose will attempt to reconnect...');
});
db.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully.');
});
db.on('reconnectFailed', () => {
  console.error('❌ MongoDB failed to reconnect after retries.');
});

module.exports = connectDB