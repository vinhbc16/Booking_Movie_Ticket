/**
 * Calculate ticket price based on seat name and showtime info
 * @param {string} seatName - Seat name (e.g., "A1", "C5")
 * @param {object} showtime - Showtime object containing room and price info
 * @returns {number} - Ticket price
 */
export const calculateSeatPrice = (seatName, showtime) => {
    if (!showtime || !showtime.room || !seatName) return 0;
  
    // 1. Get base price
    let price = showtime.basePrice;
  
    // 2. Determine seat row (A, B, C...)
    const rowChar = seatName.charAt(0);
    const rowIndex = rowChar.charCodeAt(0) - 65; // A=0, B=1...
    const rowNumber = rowIndex + 1; // DB usually stores from 1, 2, 3...
  
    // 3. Check VIP
    if (showtime.room.vipRows && showtime.room.vipRows.includes(rowNumber)) {
      price *= 1.5; // Your VIP pricing logic
    } 
    // 4. Check Couple
    else if (showtime.room.coupleRows && showtime.room.coupleRows.includes(rowNumber)) {
      price *= 2; // Your Couple pricing logic
    }
  
    return price;
};