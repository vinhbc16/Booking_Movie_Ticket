import React from 'react'
import { Trash2, Clock, Ticket, Armchair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Hàm helper format giờ
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit'
  })
}

// Hàm helper đếm số ghế đã đặt
const countBookedSeats = (seats = []) => {
  return seats.filter(seat => seat.status === 'booked').length;
}

export function ShowtimeItem({ showtime, onDelete }) {
  
  // Dữ liệu đã được populate từ backend
  const { movie, room, startTime, endTime, seats } = showtime;
  const bookedCount = countBookedSeats(seats);
  const totalSeats = seats.length;
  
  if (!movie || !room) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm animate-fade-in text-destructive">
        <p>Lỗi: Suất chiếu này bị thiếu Phim hoặc Phòng (ID: {showtime._id})</p>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div onClick={() => onEdit(showtime) }
    className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm animate-fade-in cursor-pointer">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="h-24 w-16 rounded-md object-cover"
      />
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(startTime)} → {formatTime(endTime)} ({movie.duration} phút)</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Armchair className="h-4 w-4" />
          <span>{room.name} ({room.roomType})</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Ticket className="h-4 w-4" />
          <span>Đã đặt: {bookedCount} / {totalSeats}</span>
          {bookedCount > 0 && <Badge variant="warning">Đã có người đặt</Badge>}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}