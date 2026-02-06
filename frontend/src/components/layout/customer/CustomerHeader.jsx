import React, { useState, useEffect } from 'react'
import { Ticket, User , LogOut, Settings } from 'lucide-react'
import { useNavigate, Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useLocation } from 'react-router'
import { MovieSearch } from './MovieSearch'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { authService } from '@/services/authService'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" 

const navItems = [
  { label: 'Movies', to: '/movies' },
  { label: 'Theaters', to: '/theaters' },
  { label: 'Promotions', to: '/promotions' },
]

export function CustomerHeader() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user) 
  const logout = useAuthStore((state) => state.logout)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const handleLogout = async () => {
    try{
    // 1. Call API for Backend to delete Session & Cookie
      await authService.customerLogout(); 
    } catch (error) {
      console.error("Error calling logout API:", error);
    } finally {
      // 2. REGARDLESS OF API SUCCESS, FRONTEND MUST CLEAN ITSELF
      logout(); // This Zustand function will set user = null
      
      // 3. Manually delete localStorage if Zustand persist is stuck (Strong measure)
      localStorage.removeItem('auth-storage');
    navigate('/') // Return to login page or home after logout
  }
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

  // Create variable to determine common colors for buttons (Menu, Search, User)
  // If on homepage AND not scrolled -> White color (for transparent background)
  // Otherwise -> Black/gray (for white background)
  const itemClass = isHomePage && !isScrolled
    ? "text-white hover:bg-white/20 hover:text-white" 
    : "text-gray-700 hover:bg-gray-100 hover:text-primary";

  return (
    <motion.header
    // Initial state: Translate up 100% (off screen) and fade
      initial={{ y: -100, opacity: 0 }}
      // Target state: Back to position 0 and visible
      animate={{ y: 0, opacity: 1 }}
      // Config: Run in 0.5s
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
          {user && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.name || "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-tickets')}>
                <Ticket className="mr-2 h-4 w-4" />
                <span>My Tickets</span>
              </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-[#e4b50d] hover:bg-[#b79105] text-[#322e21]" onClick={() => navigate('/auth')}>Login</Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}