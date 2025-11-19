import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { movieService } from '@/services/movieService' // Dùng service
import { roomService } from '@/services/roomService'   // Dùng service

// Hàm helper format ngày
const formatDateForInput = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const adjustedDate = new Date(d.getTime() - (offset * 60000));
  return adjustedDate.toISOString().substring(0, 16); // "YYYY-MM-DDTHH:MM"
};

export function AddShowtimeForm({ theaterId, onSubmit }) {
  const [formData, setFormData] = useState({
    movie: '',
    room: '',
    basePrice: 100000,
    startTime: formatDateForInput(new Date()),
  })
  
  // State cho dropdowns
  const [movies, setMovies] = useState([])
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch dữ liệu cho 2 dropdowns
  useEffect(() => {
    if (!theaterId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const moviePromise = movieService.getAllMovies();
        const roomPromise = roomService.getAllRooms(theaterId);
        
        const [movieRes, roomRes] = await Promise.all([moviePromise, roomPromise]);
        
        setMovies(movieRes.data.moviesList);
        setRooms(roomRes.data.roomsList);
        
        // Tự động chọn phòng đầu tiên
        if (roomRes.data.roomsList.length > 0) {
          setFormData(prev => ({ ...prev, room: roomRes.data.roomsList[0]._id }));
        }
        // Tự động chọn phim đầu tiên
        if (movieRes.data.moviesList.length > 0) {
          setFormData(prev => ({ ...prev, movie: movieRes.data.moviesList[0]._id }));
        }
      } catch (err) {
        toast.error("Lỗi khi tải danh sách phim hoặc phòng.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [theaterId]) // Chạy lại khi theaterId thay đổi

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.movie || !formData.room) {
      toast.error("Vui lòng chọn phim và phòng.");
      return;
    }
    // Gửi đi { movie, room, basePrice, startTime }
    onSubmit(formData)
  }

  if (isLoading) return <p>Đang tải dữ liệu form...</p>

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="movie">Chọn phim</Label>
        <Select id="movie" value={formData.movie} onValueChange={(v) => handleSelectChange('movie', v)}>
          <SelectTrigger><SelectValue placeholder="Chọn phim..." /></SelectTrigger>
          <SelectContent>
            {movies.map(movie => (
              <SelectItem key={movie._id} value={movie._id}>{movie.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="room">Chọn phòng</Label>
        <Select id="room" value={formData.room} onValueChange={(v) => handleSelectChange('room', v)}>
          <SelectTrigger><SelectValue placeholder="Chọn phòng..." /></SelectTrigger>
          <SelectContent>
            {rooms.map(room => (
              <SelectItem key={room._id} value={room._id}>{room.name} ({room.roomType})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="basePrice">Giá vé gốc (VNĐ)</Label>
        <Input id="basePrice" type="number" min="0" value={formData.basePrice} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startTime">Thời gian bắt đầu</Label>
        <Input id="startTime" type="datetime-local" value={formData.startTime} onChange={handleChange} required />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Tạo suất chiếu</Button>
      </div>
    </form>
  )
}