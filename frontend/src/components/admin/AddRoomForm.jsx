import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const emptyFormState = {
  name: '',
  numberOfRows: 10,
  seatsPerRow: 10,
  roomType: '2D',
  status: 'active',
  vipRows: '', // Dùng string '4, 5, 6'
  coupleRows: '', // Dùng string '1, 2'
}

// Hàm helper
const arrayToCommaString = (arr) => Array.isArray(arr) ? arr.join(', ') : ''
const commaStringToArray = (str) => str.split(',')
  .map(s => Number(s.trim()))
  .filter(n => n > 0) // Lọc số 0 hoặc NaN

export function AddRoomForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(emptyFormState)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        numberOfRows: initialData.numberOfRows || 10,
        seatsPerRow: initialData.seatsPerRow || 10,
        roomType: initialData.roomType || '2D',
        status: initialData.status || 'active',
        vipRows: arrayToCommaString(initialData.vipRows),
        coupleRows: arrayToCommaString(initialData.coupleRows),
      })
    } else {
      setFormData(emptyFormState)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Chuẩn bị dữ liệu gửi đi (chuyển string sang mảng số)
    const dataToSubmit = {
      ...formData,
      numberOfRows: Number(formData.numberOfRows),
      seatsPerRow: Number(formData.seatsPerRow),
      vipRows: commaStringToArray(formData.vipRows),
      coupleRows: commaStringToArray(formData.coupleRows),
    }
    
    onSubmit(dataToSubmit)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="name">Tên phòng</Label>
        <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ví dụ: Phòng 01" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfRows">Số hàng ghế</Label>
          <Input id="numberOfRows" type="number" min="1" value={formData.numberOfRows} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seatsPerRow">Số ghế mỗi hàng</Label>
          <Input id="seatsPerRow" type="number" min="1" value={formData.seatsPerRow} onChange={handleChange} required />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
          <Label htmlFor="roomType">Loại phòng</Label>
          <Select id="roomType" value={formData.roomType} onValueChange={(v) => handleSelectChange('roomType', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2D">2D</SelectItem>
              <SelectItem value="3D">3D</SelectItem>
              <SelectItem value="IMAX">IMAX</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select id="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="maintenance">Bảo trì</SelectItem>
              <SelectItem value="closed">Đóng cửa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vipRows">Các hàng ghế VIP (cách nhau bằng dấu phẩy)</Label>
        <Input id="vipRows" value={formData.vipRows} onChange={handleChange} placeholder="Ví dụ: 4, 5, 6" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coupleRows">Các hàng ghế đôi (cách nhau bằng dấu phẩy)</Label>
        <Input id="coupleRows" value={formData.coupleRows} onChange={handleChange} placeholder="Ví dụ: 1, 2" />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Lưu phòng</Button>
      </div>
    </form>
  )
}