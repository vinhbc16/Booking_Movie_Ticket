import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

const CustomerProtectedRoute = () => {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)
  const location = useLocation() // Lấy địa chỉ hiện tại (VD: /booking/123)

  // Đang check token (F5) thì không làm gì
  if (isCheckingAuth) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ); 
  }

  // Nếu đã đăng nhập -> Cho phép vào
  if (isAuthenticated && user) {
    return <Outlet />
  }

  // Nếu chưa đăng nhập -> Chuyển về login
  // state={{ from: location }} là chìa khóa để quay lại
  return <Navigate to="/auth" state={{ from: location }} replace />
}

export default CustomerProtectedRoute