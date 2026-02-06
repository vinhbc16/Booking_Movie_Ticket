import React from "react";
import { cn } from "@/lib/utils";

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
  vipRows = [], // Array of VIP row numbers [3, 4, 5]
  coupleRows = [], // Array of Couple row numbers [8]
  onSeatClick,
}) => {
  const renderSeat = (r, c) => {
    const seatName = getSeatLabel(r, c); // 1. Determine Seat Type & Status (Keep unchanged)
    const rowNumber = r + 1;
    const isVip = vipRows.includes(rowNumber);
    const isCouple = coupleRows.includes(rowNumber);
    const isBooked = bookedSeats.includes(seatName);
    const isHeld = heldSeats.includes(seatName);
    const isSelected = selectedSeats.includes(seatName); // 2. Base Style (Normal Seat - Not booked)
    // Add hover:border-white so when hovering empty seat it lights up
    let baseStyle =
      "relative flex items-center justify-center text-xs font-bold transition-all duration-200 transform hover:scale-110 border";
    let seatColor =
      "bg-[#3c3c55] border-transparent text-gray-400 hover:bg-[#4c4c66] hover:border-white/50 cursor-pointer";
    let shape = "rounded-t-lg h-8 w-8 mx-auto"; // 3. Style by Seat Type (Vip/Couple)

    if (isCouple) {
      shape = "rounded-lg h-8 w-16 mx-auto col-span-2";
      if (!isBooked && !isHeld && !isSelected)
        seatColor =
          "bg-[#ec4899] text-white hover:bg-[#db2777] border-transparent cursor-pointer";
    } else if (isVip) {
      if (!isBooked && !isHeld && !isSelected)
        seatColor =
          "bg-[#8b5cf6] text-white hover:bg-[#7c3aed] border-[#a78bfa] cursor-pointer";
    } // 4. Style by Status (Important override)

    if (isBooked) {
      // FIX HERE: Make it fully dark, disable hover scale, disable bright color
      seatColor =
        "bg-[#1a1a2e] border-white/5 text-[#2d2d44] cursor-not-allowed hover:scale-100 hover:bg-[#1a1a2e] shadow-none";
    } else if (isHeld) {
      seatColor =
        "bg-red-900/50 border-red-800 text-red-500 cursor-not-allowed animate-pulse hover:scale-100";
    } else if (isSelected) {
      seatColor =
        "bg-[#F5C518] border-[#F5C518] text-black shadow-[0_0_15px_rgba(245,197,24,0.6)] scale-110 z-10";
    }

    return (
      <div
        key={seatName}
        onClick={() =>
          !isBooked && !isHeld && onSeatClick(seatName, isVip, isCouple)
        }
        className={cn(baseStyle, seatColor, shape)} // Bỏ biến cursor vì đã gộp vào seatColor
        style={isCouple ? { gridColumn: "span 2" } : {}}
      >
        {/* Only show seat name if not booked, or show faded if booked */}
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{seatName}</span>{" "}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Screen */}
      <div className="w-[80%] max-w-3xl mb-12 relative">
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-purple-300/50 text-sm tracking-[0.5em] uppercase font-light">
          Screen
        </div>
        {/* Screen light effect */}
        <div className="absolute top-2 left-0 w-full h-16 bg-gradient-to-b from-purple-900/20 to-transparent clip-path-trapezoid"></div>
      </div>

      {/* Seat Grid */}
      <div
        className="grid gap-y-3 gap-x-2 mb-10 p-8 bg-[#151522] rounded-3xl border border-white/5 shadow-inner"
        style={{
          // Auto calculate columns
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            // Logic to skip column if couple seat (to avoid overlapping render)
            // This is simple display logic, actual couple seats need more complex index handling
            // Temporarily render normally, you need to fine-tune grid logic if couple seats span 2 actual cells
            return renderSeat(r, c);
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#3c3c55] rounded"></div> Standard
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#8b5cf6] rounded"></div> VIP
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#ec4899] rounded"></div> Couple
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#F5C518] rounded"></div> Selecting
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded"></div> Booked
        </div>
      </div>
    </div>
  );
};
