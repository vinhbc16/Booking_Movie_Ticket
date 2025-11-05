import React from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter , Routes , Route , Navigate } from "react-router"
import AuthPage from "./pages/AuthPage"

// Import các component mới
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import MovieManagement from "./pages/admin/MovieManagement"
import TheaterManagement from "./pages/admin/TheaterManagement"
import ShowtimeManagement from "./pages/admin/ShowtimeManagement"
import RoomManagement from "./pages/admin/RoomManagement"
import UserManagement from "./pages/admin/UserManagement"

// Giả lập một trang Home để bạn thấy sự khác biệt
function HomePage() {
  return <h1 className="p-10 text-3xl">Đây là trang chủ</h1>
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Route index: /admin -> /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="movies" element={<MovieManagement />} />
            <Route path="theaters" element={<TheaterManagement />} />
            <Route path="showtimes" element={<ShowtimeManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Routes>
      
      {/* Thêm Toaster ở đây để nó hiển thị toàn trang */}
      <Toaster richColors position="bottom-right" />
    </>
  )
}

export default App

