import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function AdminLayout() {
  return (
  // Sử dụng màu nền 'background-secondary' bạn đã định nghĩa
  <div className="flex min-h-screen w-full bg-background-secondary">
    <Sidebar />
    <main className="flex-1 p-6 lg:p-8">
      <Outlet />
    </main>
  </div>

)

}

export default AdminLayout