import React from 'react'
import { Ticket, User } from 'lucide-react'
import { useNavigate, Link } from 'react-router'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Phim', to: '/movies' },
  { label: 'Rạp chiếu', to: '/theaters' },
  { label: 'Ưu đãi', to: '/promotions' },
]

export function CustomerHeader() {
  const navigate = useNavigate()

  // TODO: Kiểm tra xem user đã đăng nhập chưa
  const isLoggedIn = false // Giả sử chưa đăng nhập

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Ticket className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">MyTicket</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="link"
              className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button variant="outline" size="icon" onClick={() => navigate('/profile')}>
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/auth')}>Đăng nhập</Button>
          )}
        </div>
      </div>
    </header>
  )
}