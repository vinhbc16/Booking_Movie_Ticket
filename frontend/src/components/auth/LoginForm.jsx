import React, { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router" // 1. IMPORT HOOK NÀY

// Import service của chúng ta
import { authService } from "@/services/authService"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const navigate = useNavigate() // 2. KHỞI TẠO HOOK
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

    const loginPromise = authService.login(formData) // Tách promise ra

    toast.promise(
      loginPromise, // Dùng promise ở đây
      {
        loading: "Đang đăng nhập...",
        success: (response) => {
          // 3. THÊM LOGIC XỬ LÝ KHI THÀNH CÔNG
          
          // Lấy token và user từ response
          const { token, user } = response.data 

          // Lưu vào localStorage (Cực kỳ quan trọng cho ProtectedRoute)
          localStorage.setItem("token", token)
          localStorage.setItem("userRole", user.role)

          // Điều hướng dựa trên role
          if (user.role === 'admin') {
            navigate('/admin')
          } else if (user.role === 'staff') {
            navigate('/staff') // (Hoặc route của staff)
          } else {
            navigate('/') // (Route của customer/trang chủ)
          }

          // Trả về thông báo cho toast
          return `Chào mừng trở lại, ${user.username}!`
        },
        error: (err) => {
          return err.response?.data?.message || "Đăng nhập thất bại!"
        },
        finally: () => {
          setIsLoading(false)
        },
      }
    )
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