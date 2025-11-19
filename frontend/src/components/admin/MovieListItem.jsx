import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils' // Import cn

// Component cho 1 item phim
export function MovieListItem({ movie, onEdit, onDelete }) {
  
  // Cập nhật hàm này để khớp enum
  const getStatusBadge = (status) => {
    switch (status) {
      case 'showing': return <Badge variant="success">Đang chiếu</Badge>
      case 'coming_soon': return <Badge variant="info">Sắp chiếu</Badge>
      case 'ended': return <Badge variant="destructive">Đã kết thúc</Badge>
      default: return <Badge variant="secondary">{status || 'Không rõ'}</Badge>
    }
  }

  // Hàm helper cho badge rating
  const getRatingBadge = (rating) => {
    switch (rating) {
      case 'P': return <Badge className="bg-green-600 text-white">{rating}</Badge>
      case 'C13': return <Badge className="bg-blue-600 text-white">{rating}</Badge>
      case 'C16': return <Badge className="bg-orange-600 text-white">{rating}</Badge>
      case 'C18': return <Badge className="bg-red-600 text-white">{rating}</Badge>
      default: return <Badge variant="secondary">{rating}</Badge>
    }
  }
   console.log("Render phim:", movie.title, "| Poster URL là:", movie.posterUrl);

   const handleDelete = (e) => {
    // 3. Ngăn sự kiện "onEdit" của cha
    e.stopPropagation()
    onDelete()
  }

  return (
    <div 
    onClick={() => onEdit(movie)}
    className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm animate-fade-in cursor-pointer" >
      <img
        // 1. Dùng posterUrl
        src={movie.posterUrl || "https://via.placeholder.com/100x150?text=No+Image"}
        alt={movie.title}
        className="h-24 w-16 rounded-md object-cover"
      />
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        
        <p className="text-sm text-muted-foreground">
          Đạo diễn: {movie.director || 'N/A'}
        </p>

        <p className="text-sm text-muted-foreground">
          {/* 2. Join mảng genre */}
          Thể loại: {Array.isArray(movie.genre) ? movie.genre.join(', ') : 'N/A'}
        </p>

        <p className="text-sm text-muted-foreground">
          Thời lượng: {movie.duration || 'N/A'} phút
        </p>

        {/* 3. Thêm badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {getStatusBadge(movie.status)}
          {getRatingBadge(movie.ageRating)}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(movie)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}