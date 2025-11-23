import React from 'react'
import { NavLink, useNavigate } from 'react-router' // Thêm useNavigate
import {
  LayoutDashboard,
  Film,
  Building,
  CalendarClock,
  Users,
  Ticket,
  LogOut // Thêm icon LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext' // 1. Import AuthContext

// Danh sách các mục menu (Đã xóa Room vì logic nested route)
const navItems = [
  { to: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: 'movies', icon: Film, label: 'Quản lý phim' },
  { to: 'theaters', icon: Building, label: 'Quản lý rạp' },
  { to: 'showtimes', icon: CalendarClock, label: 'Quản lý suất chiếu' },
  { to: 'users', icon: Users, label: 'Quản lý người dùng' },
]

function Sidebar() {
  const { logout } = useAuth() // 2. Lấy hàm logout
  const navigate = useNavigate()

  const handleLogout = () => {
    logout() // Xóa token
    navigate('/') // Quay về trang trủ
  }

  return (
    // Thêm 'flex flex-col' để dàn trang dọc
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-sidebar-background text-sidebar-foreground shadow-lg">
      
      {/* Header Sidebar */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border shadow-sm">
        {/* <Ticket className="h-8 w-8 text-primary" />
        <h1 className="ml-2 text-2xl font-bold">Admin</h1> */}
        <img 
            src="/logo.png" 
            alt="Admin Logo" 
            className="h-10 w-auto object-contain" 
        />
      </div>

      {/* Menu Items (flex-1 để chiếm khoảng trống còn lại) */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Footer Sidebar (Nút Đăng xuất) */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center rounded-lg px-4 py-3 text-destructive transition-colors duration-200",
            "hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-4 font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}

// Component NavLink con
const SidebarLink = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      end // Thêm end để tránh active nhầm
      className={({ isActive }) =>
        cn(
          'flex items-center rounded-lg px-4 py-3 transition-colors duration-200',
          isActive
            ? 'bg-primary-dark text-primary-foreground shadow-md'
            : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span className="ml-4 font-medium">{label}</span>
    </NavLink>
  )
}

export default Sidebar