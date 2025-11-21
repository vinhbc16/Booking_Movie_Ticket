import React from 'react'
import { Navigate, Outlet } from 'react-router'

// Giả sử sau khi đăng nhập, bạn lưu role vào localStorage
const useAuth = () => {
  // Thay thế logic này bằng logic xác thực thật của bạn
  const user = { role: 'admin' } // GIẢ LẬP ĐĂNG NHẬP ADMIN
  // const userRole = localStorage.getItem('userRole'); 
  // if (userRole === 'admin') return true;
  return user.role === 'admin'
}

const AdminProtectedRoute = () => {
  const isAdmin = useAuth()

  // Nếu là admin, cho phép truy cập.
  // <Outlet /> sẽ render bất cứ route con nào (vd: AdminLayout)
  return isAdmin ? <Outlet /> : <Navigate to="/auth" />
}

export default AdminProtectedRoute