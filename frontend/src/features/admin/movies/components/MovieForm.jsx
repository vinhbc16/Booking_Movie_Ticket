import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea' // MỚI
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" // MỚI

// Hàm helper để format Date sang yyyy-MM-dd
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toISOString().split('T')[0]
  } catch (e) {
    return ''
  }
}

// State khởi tạo rỗng, khớp với schema
const emptyFormState = {
  title: '',
  description: '',
  duration: '',
  genre: '', // Sẽ là string 'A, B, C' trong form
  director: '',
  actors: '', // Sẽ là string 'A, B, C' trong form
  language: 'Việt Nam',
  releaseDate: '',
  status: 'showing',
  ageRating: 'P',
  posterUrl: '',
  trailerUrl: '',
}

export function MovieForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(emptyFormState)

  useEffect(() => {
    // Nếu có initialData (chế độ "Sửa"), điền form
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        duration: initialData.duration || '',
        // Chuyển mảng [String] thành string 'A, B, C'
        genre: Array.isArray(initialData.genre) ? initialData.genre.join(', ') : '',
        director: initialData.director || '',
        actors: Array.isArray(initialData.actors) ? initialData.actors.join(', ') : '',
        language: initialData.language || 'Việt Nam',
        // Format Date cho input type="date"
        releaseDate: formatDateForInput(initialData.releaseDate),
        status: initialData.status || 'showing',
        ageRating: initialData.ageRating || 'P',
        posterUrl: initialData.posterUrl || '',
        trailerUrl: initialData.trailerUrl || '',
      })
    } else {
      // Chế độ "Thêm mới", reset form
      setFormData(emptyFormState)
    }
  }, [initialData]) // Chạy lại khi initialData thay đổi

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Xử lý riêng cho các component Select
  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Chuẩn bị dữ liệu để gửi đi
    const dataToSubmit = {
      ...formData,
      // Chuyển string 'A, B, C' thành mảng [String]
      genre: formData.genre.split(',').map(item => item.trim()).filter(Boolean),
      actors: formData.actors.split(',').map(item => item.trim()).filter(Boolean),
      // Đảm bảo duration là Number
      duration: Number(formData.duration),
    }
    
    onSubmit(dataToSubmit) // Gửi dữ liệu đã xử lý về component cha
  }

  return (
    // Dùng overflow-y-auto để cuộn form nếu nội dung quá dài
    <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Tên phim</Label>
        <Input id="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">Mô tả</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="posterUrl" className="text-right">Poster URL</Label>
        <Input id="posterUrl" value={formData.posterUrl} onChange={handleChange} className="col-span-3" required />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="trailerUrl" className="text-right">Trailer URL</Label>
        <Input id="trailerUrl" value={formData.trailerUrl} onChange={handleChange} className="col-span-3" required />
      </div>

      {/* Chia 2 cột cho các trường ngắn */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Thời lượng (phút)</Label>
          <Input id="duration" type="number" value={formData.duration} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="releaseDate">Ngày phát hành</Label>
          <Input id="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} required />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
          <Label htmlFor="director">Đạo diễn</Label>
          <Input id="director" value={formData.director} onChange={handleChange} required />
        </div>
         <div className="space-y-2">
          <Label htmlFor="language">Ngôn ngữ</Label>
          <Input id="language" value={formData.language} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="genre" className="text-right pt-2">Thể loại</Label>
        <Textarea id="genre" value={formData.genre} onChange={handleChange} className="col-span-3" placeholder="Hành động, Hài, Tình cảm (cách nhau bằng dấu phẩy)" required />
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="actors" className="text-right pt-2">Diễn viên</Label>
        <Textarea id="actors" value={formData.actors} onChange={handleChange} className="col-span-3" placeholder="Tên A, Tên B, Tên C (cách nhau bằng dấu phẩy)" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select id="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="showing">Đang chiếu</SelectItem>
              <SelectItem value="coming_soon">Sắp chiếu</SelectItem>
              <SelectItem value="ended">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ageRating">Giới hạn tuổi</Label>
          <Select id="ageRating" value={formData.ageRating} onValueChange={(value) => handleSelectChange('ageRating', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới hạn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P">P (Mọi lứa tuổi)</SelectItem>
              <SelectItem value="C13">C13</SelectItem>
              <SelectItem value="C16">C16</SelectItem>
              <SelectItem value="C18">C18</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Lưu phim</Button>
      </div>
    </form>
  )
}