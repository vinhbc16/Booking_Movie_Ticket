import React, { useState } from "react"
// Thêm icon Phone
import { Mail, Lock, User, Phone } from "lucide-react"
import { toast } from "sonner"

// Import service của chúng ta
import { authService } from "@/services/authService"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "", // <-- THÊM MỚI
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!")
      return
    }

    setIsLoading(true)

    // Tách các trường cần gửi đi (không gửi confirmPassword)
    const { username, email, password, phone } = formData

    toast.promise(
      // 🚀 SỬ DỤNG SERVICE TẠI ĐÂY
      authService.register({ username, email, password, phone }),
      {
        loading: "Đang tạo tài khoản...",
        success: (response) => {
          // Giả sử API trả về { message: "..." } hoặc data
          return response.data?.message || "Tạo tài khoản thành công! Vui lòng đăng nhập."
        },
        error: (err) => {
          return err.response?.data?.message || "Đăng ký thất bại!"
        },
        finally: () => {
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="username">Tên người dùng</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            placeholder="nguyenvanA"
            required
            className="pl-10"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email Input */}
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

      {/* 📱 SỐ ĐIỆN THOẠI (THÊM MỚI) */}
      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="phone"
            placeholder="09xxxxxxxx"
            required
            className="pl-10"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Input */}
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

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            className="pl-10"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
      </Button>
    </form>
  )
}