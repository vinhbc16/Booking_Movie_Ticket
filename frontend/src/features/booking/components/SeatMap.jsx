import React from 'react';
import { cn } from '@/lib/utils';

// Helper để tạo tên ghế (A1, B2...)
const getSeatLabel = (rowIndex, colIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex); // 0->A, 1->B
    return `${rowLabel}${colIndex + 1}`;
};

export const SeatMap = ({ 
    rows, 
    cols, 
    bookedSeats = [], // Ghế đã bán (từ DB)
    heldSeats = [],   // Ghế đang bị giữ (từ Redis/Socket)
    selectedSeats = [], // Ghế mình đang chọn
    onSeatClick 
}) => {
    
    const renderSeat = (r, c) => {
        const seatName = getSeatLabel(r, c);
        
        // Kiểm tra trạng thái
        const isBooked = bookedSeats.includes(seatName);
        const isHeld = heldSeats.includes(seatName);
        const isSelected = selectedSeats.includes(seatName);
        
        // Logic màu sắc
        let seatColor = "bg-white border-gray-300 hover:border-blue-500"; // Mặc định
        let cursor = "cursor-pointer";

        if (isBooked) {
            seatColor = "bg-gray-400 border-gray-400 cursor-not-allowed"; // Đã bán
            cursor = "cursor-not-allowed";
        } else if (isHeld) {
            seatColor = "bg-yellow-400 border-yellow-400 cursor-not-allowed"; // Người khác đang giữ
            cursor = "cursor-not-allowed";
        } else if (isSelected) {
            seatColor = "bg-green-500 border-green-500 text-white"; // Mình đang chọn
        }

        return (
            <div
                key={seatName}
                onClick={() => !isBooked && !isHeld && onSeatClick(seatName)}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-t-lg border-2 text-xs font-bold transition-all",
                    seatColor, cursor
                )}
            >
                {seatName}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-2 items-center">
            {/* Màn hình */}
            <div className="w-full max-w-2xl mb-8">
                <div className="h-2 w-full bg-gray-300 rounded-full mb-2"></div>
                <p className="text-center text-gray-400 text-sm">MÀN HÌNH</p>
            </div>

            {/* Lưới ghế */}
            <div 
                className="grid gap-2"
                style={{ 
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
                }}
            >
                {Array.from({ length: rows }).map((_, r) => (
                    Array.from({ length: cols }).map((_, c) => renderSeat(r, c))
                ))}
            </div>
            
            {/* Chú thích */}
            <div className="flex gap-4 mt-8 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-300 bg-white"></div> Trống</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500"></div> Đang chọn</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-400"></div> Đã bán</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400"></div> Đang giữ</div>
            </div>
        </div>
    );
};