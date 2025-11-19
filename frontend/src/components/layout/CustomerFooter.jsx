import React from 'react'
import { Ticket } from 'lucide-react'

export function CustomerFooter() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {/* Cột 1: Logo */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">MyTicket</span>
          </div>
          <p className="mt-4 text-sm">
            Nền tảng đặt vé xem phim hàng đầu Việt Nam.
          </p>
        </div>

        {/* Cột 2: Phim */}
        <div>
          <h3 className="font-bold uppercase text-white">Phim</h3>
          <nav className="mt-4 flex flex-col gap-2">
            <a href="#" className="hover:text-white">Phim đang chiếu</a>
            <a href="#" className="hover:text-white">Phim sắp chiếu</a>
          </nav>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h3 className="font-bold uppercase text-white">Hỗ trợ</h3>
          <nav className="mt-4 flex flex-col gap-2">
            <a href="#" className="hover:text-white">FAQ</a>
            <a href="#" className="hover:text-white">Chính sách</a>
            <a href="#" className="hover:text-white">Liên hệ</a>
          </nav>
        </div>

        {/* Cột 4: Mạng xã hội */}
        <div>
          <h3 className="font-bold uppercase text-white">Kết nối</h3>
          {/* (Thêm icons mạng xã hội ở đây nếu muốn) */}
        </div>
      </div>
      <div className="border-t border-gray-800 bg-gray-950 py-6">
        <p className="text-center text-sm">
          © 2025 MyTicket. All rights reserved.
        </p>
      </div>
    </footer>
  )
}