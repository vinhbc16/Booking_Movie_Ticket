import React from 'react'
import { Pencil, Trash2, Armchair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Component cho 1 item phòng
export function RoomListItem({ room, onEdit, onDelete }) {
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge variant="success">Hoạt động</Badge>
      case 'maintenance': return <Badge variant="info">Bảo trì</Badge>
      case 'closed': return <Badge variant="destructive">Đóng cửa</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalSeats = room.numberOfRows * room.seatsPerRow;

  return (
    <div onClick={() => onEdit(room)} 
    className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm animate-fade-in cursor-pointer">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Armchair className="h-6 w-6" />
      </div>
      
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold">{room.name}</h3>
        <p className="text-sm text-muted-foreground">
          Tổng số ghế: {totalSeats} ({room.numberOfRows} x {room.seatsPerRow})
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {getStatusBadge(room.status)}
          <Badge variant="outline">{room.roomType}</Badge>
          {room.vipRows?.length > 0 && <Badge variant="warning">Có ghế VIP</Badge>}
          {room.coupleRows?.length > 0 && <Badge variant="love">Có ghế đôi</Badge>}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(room)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}