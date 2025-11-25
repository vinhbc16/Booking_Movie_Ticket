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
    name: "",
    email: "",
    phone: "", 
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
    const { name, email, password, phone } = formData

    // Có thể sử dụng cấu hình toast như bên login cho phép chỉnh thời gian log riêng biệt
    toast.promise(
      // 🚀 SỬ DỤNG SERVICE TẠI ĐÂY
      authService.register({ name, email, password, phone }),
      {
        loading: "Đang tạo tài khoản...",
        success: (response) => {
          // Giả sử API trả về { msg: "..." } hoặc data
          return response.data?.msg || "Tạo tài khoản thành công! Vui lòng đăng nhập."
        },
        error: (err) => {
          console.log("Lỗi Backend trả về:", err.response?.data);
          
          // Ưu tiên 1: Lấy 'msg' từ Backend middleware của bạn
          if (err.response?.data?.msg) {
            return err.response.data.msg;
          }
          
          // Ưu tiên 2: Lấy 'message' (nếu có thư viện nào khác trả về)
          if (err.response?.data?.message) {
            return err.response.data.message;
          }

          // Ưu tiên 3: Lỗi mạng hoặc lỗi không xác định
          return err.message || "Đăng ký thất bại! Vui lòng thử lại.";
        },
        finally: () => {
          setIsLoading(false)
        }
      }
    )
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="name">Tên người dùng</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            placeholder="Nguyen Van A"
            required
            className="pl-10"
            value={formData.name}
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
            placeholder="nguyenvana@gmail.com"
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