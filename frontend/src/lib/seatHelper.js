/**
 * Tính giá vé dựa trên tên ghế và thông tin suất chiếu
 * @param {string} seatName - Tên ghế (VD: "A1", "C5")
 * @param {object} showtime - Object suất chiếu chứa thông tin room và price
 * @returns {number} - Giá vé
 */
export const calculateSeatPrice = (seatName, showtime) => {
    if (!showtime || !showtime.room || !seatName) return 0;
  
    // 1. Lấy giá cơ bản
    let price = showtime.basePrice;
  
    // 2. Xác định hàng ghế (A, B, C...)
    const rowChar = seatName.charAt(0);
    const rowIndex = rowChar.charCodeAt(0) - 65; // A=0, B=1...
    const rowNumber = rowIndex + 1; // DB thường lưu từ 1, 2, 3...
  
    // 3. Check VIP
    if (showtime.room.vipRows && showtime.room.vipRows.includes(rowNumber)) {
      price *= 1.5; // Hoặc logic giá VIP của bạn
    } 
    // 4. Check Couple
    else if (showtime.room.coupleRows && showtime.room.coupleRows.includes(rowNumber)) {
      price *= 2; // Hoặc logic giá Couple của bạn
    }
  
    return price;
};