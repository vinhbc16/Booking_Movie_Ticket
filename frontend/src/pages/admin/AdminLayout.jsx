import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from '@/components/admin/Sidebar' // Chúng ta sẽ tạo file này

function AdminLayout() {
  return (
    // Sử dụng màu nền 'background-secondary' bạn đã định nghĩa
    <div className="flex min-h-screen w-full bg-background-secondary">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        {/* Đây là nơi các trang con (Dashboard, Movies...) sẽ được render */}
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout