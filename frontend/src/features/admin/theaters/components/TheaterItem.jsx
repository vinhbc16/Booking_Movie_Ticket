import React from 'react'
import { Pencil, Trash2, Building, DoorOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils' // 1. Import cn

// Component cho 1 item rạp
export function TheaterItem({ theater, onEdit, onDelete }) {
  const navigate = useNavigate()

  const handleManageRooms = (e) => {
    // 3. Ngăn sự kiện "onEdit" của cha
    e.stopPropagation() 
    navigate(`/admin/theaters/${theater._id}/rooms`)
  }

  const handleDelete = (e) => {
    // 3. Ngăn sự kiện "onEdit" của cha
    e.stopPropagation()
    onDelete() // Gọi hàm onDelete đã được truyền vào
  }

  return (
    // 2. THÊM onClick, cursor-pointer và hover
    <div 
      onClick={() => onEdit(theater)} 
      className={cn(
        "flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm animate-fade-in",
        "cursor-pointer transition-colors"
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Building className="h-6 w-6" />
      </div>
      
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold">{theater.name}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {theater.address}
        </p>
      </div>

      {/* 4. NÚT MỚI: QUẢN LÝ PHÒNG */}
      <Button variant="outline" onClick={handleManageRooms}>
        <DoorOpen className="mr-2 h-4 w-4" />
        Quản lý phòng
      </Button>

      <div className="flex flex-col space-y-2">
        {/* 5. Nút Sửa (bút chì) đã bị XÓA */}
        
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}