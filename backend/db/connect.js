// require('dotenv').config()
// const mongoose = require('mongoose')

// const connectDB = (url) => {
//     return mongoose.connect(url)
// }

// module.exports = connectDB

require('dotenv').config()
const mongoose = require('mongoose')

// 1. CÁC TÙY CHỌN KẾT NỐI (RẤT QUAN TRỌNG)
const connectionOptions = {
  // Các tùy chọn này (có thể thay đổi tùy phiên bản Mongoose)
  // giúp Mongoose chủ động giữ kết nối và xử lý lỗi:

  // Gửi "ping" (heartbeat) đến DB mỗi 10 giây để giữ kết nối "sống"
  heartbeatFrequencyMS: 10000,
  
  // Hủy một hoạt động nếu không thể chọn được server trong 5 giây
  serverSelectionTimeoutMS: 5000,

  // Hủy một hoạt động socket sau 45 giây không hoạt động
  socketTimeoutMS: 45000
};

const connectDB = (url) => {
  console.log('Connecting to MongoDB Atlas...');
  // 2. SỬ DỤNG CÁC TÙY CHỌN KHI KẾT NỐI
  return mongoose.connect(url, connectionOptions)
}

// ----------------------------------------------------
// 3. THÊM CÁC TRÌNH LẮNG NGHE SỰ KIỆN (ĐỂ DEBUG)
// ----------------------------------------------------
const db = mongoose.connection;

// Báo lỗi nếu kết nối thất bại ngay từ đầu
db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Báo khi kết nối thành công
db.on('connected', () => {
  console.log('✅ MongoDB Atlas connected successfully.');
});

// ⚠️ BÁO KHI BỊ NGẮT KẾT NỐI (Đây là lỗi của bạn)
db.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Mongoose will attempt to reconnect...');
});

// Báo khi kết nối lại thành công
db.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully.');
});

// Báo khi không thể kết nối lại sau nhiều lần thử
db.on('reconnectFailed', () => {
  console.error('❌ MongoDB failed to reconnect after retries.');
});
// ----------------------------------------------------

module.exports = connectDB