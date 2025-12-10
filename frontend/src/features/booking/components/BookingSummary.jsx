import React from 'react'
import { X, Armchair, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function BookingSummary({ showtime, selectedSeats, totalPrice, onConfirm }) {
  if (!showtime) return null

  return (
    <div className="bg-[#1c1c2e] text-white rounded-2xl p-6 shadow-2xl h-fit sticky top-24 border border-white/10">
      <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Thông tin đặt vé</h2>

      {/* Thông tin phim */}
      <div className="flex gap-4 mb-6">
        <img 
          src={showtime.movie.posterUrl} 
          alt={showtime.movie.title} 
          className="w-24 h-36 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-lg leading-tight">{showtime.movie.title}</h3>
          <p className="text-sm text-gray-400">{showtime.room.theater.name}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
             <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
               {showtime.room.name}
             </Badge>
             <span>•</span>
             <span>{new Date(showtime.startTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>

      {/* Danh sách ghế */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Ghế đã chọn ({selectedSeats.length})</span>
          <Ticket className="w-4 h-4" />
        </div>
        
        {selectedSeats.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <Badge key={seat} className="bg-[#2c2c44] hover:bg-[#3c3c55] text-white px-3 py-1">
                {seat} 
                {/* Bạn có thể thêm nút xóa X ở đây nếu muốn */}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 italic">Chưa chọn ghế nào</p>
        )}
      </div>

      {/* Tổng tiền */}
      <div className="border-t border-white/10 pt-4 mb-6">
        <div className="flex justify-between items-end">
          <span className="text-gray-400">Tổng cộng</span>
          <span className="text-3xl font-bold text-[#F5C518]">
            {totalPrice.toLocaleString()} đ
          </span>
        </div>
      </div>

      {/* Nút đặt vé */}
      <Button 
        size="lg" 
        className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold h-12 text-lg shadow-lg shadow-purple-900/20"
        disabled={selectedSeats.length === 0}
        onClick={onConfirm}
      >
        Xác nhận thanh toán
      </Button>
    </div>
  )
}