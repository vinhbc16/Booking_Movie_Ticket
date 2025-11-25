import React, { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router" // 1. IMPORT HOOK NÀY
import { useAuth } from "@/context/AuthContext" // 1. Import Hook

// Import service của chúng ta
import { authService } from "@/services/authService"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const navigate = useNavigate() // 2. KHỞI TẠO HOOK
  const { login } = useAuth() // 2. Lấy hàm login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // 1. Hiển thị loading và LƯU LẠI ID của nó
    const toastId = toast.loading("Đang đăng nhập...")

    try {
      // 2. Gọi API (dùng await để đợi kết quả)
      const response = await authService.login(formData)
      
      // --- NẾU THÀNH CÔNG (Chạy xuống đây) ---
      const { token, user } = response.data 
      login(token, user);

      // Điều hướng
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'staff') {
        navigate('/staff') 
      } else {
        navigate('/') 
      }

      // 3. Cập nhật Toast thành SUCCESS
      toast.success(`Chào mừng trở lại, ${user.name}!`, {
        id: toastId,     // Quan trọng: Dùng lại ID cũ để thay thế dòng Loading
        duration: 4000,  // 🕒 Thành công chỉ cần hiện 3 giây
      })

    } catch (err) {
      // --- NẾU CÓ LỖI (Chạy vào đây) ---
      const errorMsg = 
        err.response?.data?.msg || 
        err.response?.data?.message || 
        "Đăng nhập thất bại! Vui lòng kiểm tra lại."

      // 4. Cập nhật Toast thành ERROR
      toast.error(errorMsg, {
        id: toastId,      // Quan trọng: Dùng lại ID cũ
        duration: 7000,  // 🕒 Lỗi hiện 7 GIÂY (hoặc lâu hơn tùy bạn)
      })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            required
            className="pl-10"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="pl-10"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
    </form>
  )
}