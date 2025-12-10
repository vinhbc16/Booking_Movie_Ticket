import React from 'react';
import { cn } from '@/lib/utils';

const getSeatLabel = (rowIndex, colIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex); 
    return `${rowLabel}${colIndex + 1}`;
};

export const SeatMap = ({ 
    rows, 
    cols, 
    bookedSeats = [], 
    heldSeats = [],   
    selectedSeats = [], 
    vipRows = [],     // Mảng số hàng VIP [3, 4, 5]
    coupleRows = [],  // Mảng số hàng Couple [8]
    onSeatClick 
}) => {
    
    const renderSeat = (r, c) => {
        const seatName = getSeatLabel(r, c);
        
        // 1. Xác định Loại ghế
        const rowNumber = r + 1; // Hàng bắt đầu từ 1
        const isVip = vipRows.includes(rowNumber);
        const isCouple = coupleRows.includes(rowNumber);

        // 2. Xác định Trạng thái
        const isBooked = bookedSeats.includes(seatName);
        const isHeld = heldSeats.includes(seatName);
        const isSelected = selectedSeats.includes(seatName);
        
        // 3. Style cơ bản
        let baseStyle = "flex items-center justify-center text-xs font-bold transition-all duration-200 transform hover:scale-110";
        let seatColor = "bg-[#3c3c55] border-transparent text-gray-400 hover:bg-[#4c4c66]"; // Trống (Màu tối)
        let shape = "rounded-t-lg h-8 w-8 mx-auto"; // Hình dáng ghế thường (đơn)
        let cursor = "cursor-pointer";

        // 4. Style theo Loại ghế
        if (isCouple) {
            shape = "rounded-lg h-8 w-16 mx-auto col-span-2"; // Ghế đôi (rộng gấp đôi)
            if (!isBooked && !isHeld && !isSelected) seatColor = "bg-[#ec4899] text-white hover:bg-[#db2777]"; // Màu hồng
        } else if (isVip) {
            if (!isBooked && !isHeld && !isSelected) seatColor = "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] border border-[#a78bfa]"; // Màu tím
        }

        // 5. Style theo Trạng thái (Ghi đè màu loại ghế)
        if (isBooked) {
            seatColor = "bg-gray-600 cursor-not-allowed opacity-50"; 
            cursor = "cursor-not-allowed";
        } else if (isHeld) {
            seatColor = "bg-yellow-500 cursor-not-allowed animate-pulse text-black"; 
            cursor = "cursor-not-allowed";
        } else if (isSelected) {
            seatColor = "bg-[#F5C518] text-black shadow-[0_0_10px_#F5C518]"; // Đang chọn (Vàng sáng)
        }

        // Xử lý Click cho ghế đôi (cần logic riêng nếu muốn click 1 được 2 chỗ, tạm thời coi là 1 slot)
        return (
            <div
                key={seatName}
                onClick={() => !isBooked && !isHeld && onSeatClick(seatName, isVip, isCouple)}
                className={cn(baseStyle, seatColor, shape, cursor)}
                style={isCouple ? { gridColumn: "span 2" } : {}}
            >
                {/* Chỉ hiện tên ghế nếu đủ rộng, hoặc dùng tooltip */}
                <span className="scale-75">{seatName}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Màn hình */}
            <div className="w-[80%] max-w-3xl mb-12 relative">
                <div className="h-2 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-purple-300/50 text-sm tracking-[0.5em] uppercase font-light">Màn hình</div>
                {/* Hiệu ứng ánh sáng màn hình */}
                <div className="absolute top-2 left-0 w-full h-16 bg-gradient-to-b from-purple-900/20 to-transparent clip-path-trapezoid"></div>
            </div>

            {/* Lưới ghế */}
            <div 
                className="grid gap-y-3 gap-x-2 mb-10 p-8 bg-[#151522] rounded-3xl border border-white/5 shadow-inner"
                style={{ 
                    // Tự động tính cột
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
                }}
            >
                {Array.from({ length: rows }).map((_, r) => (
                    Array.from({ length: cols }).map((_, c) => {
                        // Logic bỏ qua cột nếu là ghế đôi (để tránh render chồng)
                        // Đây là logic hiển thị đơn giản, thực tế ghế đôi cần xử lý index phức tạp hơn
                        // Tạm thời render bình thường, bạn cần tinh chỉnh grid logic nếu ghế đôi chiếm 2 ô thực sự
                        return renderSeat(r, c)
                    })
                ))}
            </div>
            
            {/* Chú thích */}
            <div className="flex gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#3c3c55] rounded"></div> Thường</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#8b5cf6] rounded"></div> VIP</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#ec4899] rounded"></div> Đôi</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#F5C518] rounded"></div> Đang chọn</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-600 rounded"></div> Đã đặt</div>
            </div>
        </div>
    );
};