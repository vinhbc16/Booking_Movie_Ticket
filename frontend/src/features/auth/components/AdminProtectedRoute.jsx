import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/store/useAuthStore'

const AdminProtectedRoute = () => {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)

  // Nếu đang check token (lúc F5), hiện loading hoặc null
  if (isCheckingAuth) {
      return null; 
  }

  // Đã check xong, nếu đúng admin thì cho vào
  if (isAuthenticated && user?.role === 'admin') {
    return <Outlet />
  }

  // Không phải admin -> đá về trang login admin
  return <Navigate to="/admin/login" replace />
}

export default AdminProtectedRoute