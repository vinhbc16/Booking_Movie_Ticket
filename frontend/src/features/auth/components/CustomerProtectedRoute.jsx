import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

const CustomerProtectedRoute = () => {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)
  const location = useLocation()

  // 1. Đang check token -> Hiện Loading
  if (isCheckingAuth) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-gray-500">Đang kiểm tra đăng nhập...</span>
            </div>
        </div>
      ); 
  }

  // 2. Check xong: Có User & Token -> Cho vào
  if (isAuthenticated && user) {
    return <Outlet />
  }

  // 3. Check xong: Không có User/Token -> Đá về Login
  console.log("🚫 Chưa đăng nhập, chuyển hướng về Auth");
  return <Navigate to="/auth" state={{ from: location }} replace />
}

export default CustomerProtectedRoute