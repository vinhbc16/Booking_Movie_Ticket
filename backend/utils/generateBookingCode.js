const crypto = require('crypto')

function generateBookingCode() {
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 ký tự
  const timestamp = Date.now().toString().slice(-6); // 6 số cuối của timestamp
  return `BK${timestamp}${randomPart}`; // Ví dụ: BK483920A1B2C3
}

console.log(generateBookingCode())