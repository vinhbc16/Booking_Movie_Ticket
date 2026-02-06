import React from 'react'
import { NavLink, useNavigate } from 'react-router' 
import {
  LayoutDashboard,
  Film,
  Building,
  CalendarClock,
  Users,
  Ticket,
  LogOut 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

const navItems = [
  { to: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: 'movies', icon: Film, label: 'Movie Management' },
  { to: 'theaters', icon: Building, label: 'Theater Management' },
  { to: 'showtimes', icon: CalendarClock, label: 'Showtime Management' },
  { to: 'users', icon: Users, label: 'User Management' },
]

function Sidebar() {
  const logout = useAuthStore((state) => state.logout)  
  const navigate = useNavigate()

  const handleLogout = () => {
    logout() // Clear token
    navigate('/') // Return to home page
  }

  return (
    // Add 'flex flex-col' for vertical layout
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

      {/* Footer Sidebar (Logout Button) */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center rounded-lg px-4 py-3 text-destructive transition-colors duration-200",
            "hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-4 font-medium">Logout</span>
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