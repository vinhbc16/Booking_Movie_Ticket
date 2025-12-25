require('dotenv').config()
const mongoose = require('mongoose')

// 1. CÁC TÙY CHỌN KẾT NỐI
const connectionOptions = {
  // Gửi "ping" (heartbeat) đến DB mỗi 10 giây để giữ kết nối "sống"
  heartbeatFrequencyMS: 10000,
  // Hủy một hoạt động nếu không thể chọn được server trong 5 giây
  serverSelectionTimeoutMS: 5000,
  // Hủy một hoạt động socket sau 45 giây không hoạt động
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