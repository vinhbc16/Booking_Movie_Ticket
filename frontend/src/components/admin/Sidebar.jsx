import React from 'react'
import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  Film,
  Building,
  CalendarClock,
  Video,
  Users,
  Ticket,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Danh sách các mục menu
const navItems = [
  { to: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: 'movies', icon: Film, label: 'Quản lý phim' },
  { to: 'theaters', icon: Building, label: 'Quản lý rạp' },
  { to: 'rooms', icon: Video, label: 'Quản lý phòng chiếu' },
  { to: 'showtimes', icon: CalendarClock, label: 'Quản lý suất chiếu' },
  { to: 'users', icon: Users, label: 'Quản lý người dùng' },
]

function Sidebar() {
  return (
    // Sử dụng màu custom từ config của bạn
    <aside className="sticky top-0 h-screen w-64 bg-sidebar-background text-sidebar-foreground shadow-lg">
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border shadow-sm">
        <Ticket className="h-8 w-8 text-primary" />
        <h1 className="ml-2 text-2xl font-bold">Admin</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  )
}

// Component NavLink con để xử lý trạng thái active
const SidebarLink = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center rounded-lg px-4 py-3 transition-colors duration-200',
          isActive
            ? 'bg-primary-dark text-primary-foreground shadow-md' // Màu active
            : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground' // Màu hover
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span className="ml-4 font-medium">{label}</span>
    </NavLink>
  )
}

export default Sidebar