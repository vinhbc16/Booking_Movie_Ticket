import React, { useState, useEffect } from 'react'
import { Ticket, User , LogOut, Settings } from 'lucide-react'
import { useNavigate, Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext' // 1. Import Context
import { useLocation } from 'react-router' // 1. Import hook 
import { MovieSearch } from './MovieSearch'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import Dropdown

const navItems = [
  { label: 'Phim', to: '/movies' },
  { label: 'Rạp chiếu', to: '/theaters' },
  { label: 'Ưu đãi', to: '/promotions' },
]

export function CustomerHeader() {
  const navigate = useNavigate()

  const { user, logout } = useAuth() // 2. Lấy user và logout từ Context

  const handleLogout = () => {
    logout()
    navigate('/') // Quay về trang login hoặc trang chủ sau khi logout
  }

  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  // State để xử lý đổi màu header khi cuộn trang (Scroll Effect)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 1. Tạo biến xác định màu sắc chung cho các nút (Menu, Search, User)
  // Nếu ở trang chủ VÀ chưa cuộn -> Màu trắng (cho nền trong suốt)
  // Ngược lại -> Màu đen/xám (cho nền trắng)
  const itemClass = isHomePage && !isScrolled
    ? "text-white hover:bg-white/20 hover:text-white" 
    : "text-gray-700 hover:bg-gray-100 hover:text-primary";

  return (
    <motion.header
    // Trạng thái ban đầu: Dịch lên trên 100% (khuất màn hình) và mờ
      initial={{ y: -100, opacity: 0 }}
      // Trạng thái đích: Về vị trí 0 và rõ nét
      animate={{ y: 0, opacity: 1 }}
      // Cấu hình: Chạy trong 0.5s
      transition={{ duration: 1 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isHomePage 
          ? (isScrolled ? 'bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60' : 'bg-transparent bg-gradient-to-b from-black/70 to-transparent')
          : 'sticky border-b bg-background/95 shadow-sm backdrop-blur'
      }`}
    >
      <div className="container flex h-22 items-center justify-around gap-40">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          {/* <Ticket className="h-8 w-8 text-primary" />
          <span className={`text-2xl font-bold ${isHomePage && !isScrolled ? 'text-white' : 'text-primary'}`}>
            MyTicket
          </span> */}
          <img src="/logo.png" alt="Logo" className="h-11 w-auto object-contain"/> 
          {/* h-12 (48px) để vừa vặn header */}
        </Link>

        {/* MENU ITEMS */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="link"
              // className={`text-lg font-medium transition-colors ${
              //   isHomePage && !isScrolled 
              //     ? 'text-gray-200 hover:text-white' 
              //     : 'text-muted-foreground hover:text-primary'
              // }`}
              // Áp dụng itemClass vào menu luôn cho đồng bộ
              className={`text-lg font-medium transition-colors ${itemClass}`}
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MovieSearch className={itemClass}/>
          {/* 3. Kiểm tra user tồn tại để hiển thị UI tương ứng */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.username || "Tài khoản"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" /> Hồ sơ
                </DropdownMenuItem>
                {user.role === 'admin' && (
                   <DropdownMenuItem onClick={() => navigate('/admin')}>
                     <Ticket className="mr-2 h-4 w-4" /> Trang quản trị
                   </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-[#e4b50d] hover:bg-[#b79105] text-[#322e21]" onClick={() => navigate('/auth')}>Đăng nhập</Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}