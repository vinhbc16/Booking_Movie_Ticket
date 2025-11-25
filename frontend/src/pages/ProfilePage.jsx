import React from 'react'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return <div>Vui lòng đăng nhập</div>

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Hồ sơ cá nhân</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        <p><strong>Tên người dùng:</strong> {user.username}</p>
        {/* Nếu user object có thêm thông tin email/phone thì hiện ở đây */}
      </div>
    </div>
  )
}