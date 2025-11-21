import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea' // Dùng lại textarea

const emptyFormState = {
  name: '',
  address: '',
}

export function TheaterForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(emptyFormState)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
      })
    } else {
      setFormData(emptyFormState)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData) // Gửi dữ liệu về component cha
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên rạp</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Ví dụ: BHD Star Bitexco" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Ví dụ: Tầng 3, Bitexco Financial Tower,..."
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Lưu rạp</Button>
      </div>
    </form>
  )
}