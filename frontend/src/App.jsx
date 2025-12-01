import React from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter , Routes , Route , Navigate } from "react-router"

// 2. Features (Đường dẫn mới)
// Auth
import AuthPage from "@/features/auth/AuthPage"
import AdminProtectedRoute from "@/features/auth/components/AdminProtectedRoute"

// Customer Pages (Vẫn giữ ở pages vì chưa refactor feature home, hoặc bạn có thể chuyển nốt)
import HomePage from "@/pages/HomePage" 
import MoviesPage from "@/pages/MoviesPage" // 1. Import
import MovieDetailPage from "@/pages/MovieDetailPage" // Import mới
import ProfilePage from "@/pages/ProfilePage" // 1. Import
import AdminLoginPage from "@/features/auth/AdminLoginPage" // Import trang mới
// Admin Features
import MovieManagement from "@/features/admin/movies/MovieManagement"
import TheaterManagement from "@/features/admin/theaters/TheaterManagement"
import RoomManagement from "@/features/admin/rooms/RoomManagement"
import ShowtimeManagement from "@/features/admin/showtimes/ShowtimeManagement"
import { CustomerLayout } from './components/layout/customer/CustomerLayout'
import AdminLayout from './components/layout/admin/AdminLayout'
import Dashboard from "@/features/admin/dashboard/DashboardManagement"
import DashboardManagement from '@/features/admin/dashboard/DashboardManagement'


function App() {
  return (
    <>
      <Routes>
        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>\

        {/* Customer Auth */}
        <Route path="/auth" element={<AuthPage />} />

        {/* 🚀 ADMIN AUTH (Route riêng) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            
            <Route path="movies" element={<MovieManagement />} />
            {/* 1. Route Index: Tự động chuyển /admin -> /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* 2. Route Con: /admin/dashboard (ĐÂY LÀ DÒNG BẠN ĐANG THIẾU) */}
            <Route path="dashboard" element={<DashboardManagement />} />
            {/* Nested Route cho Room (Đã fix logic trước đó) */}
            <Route path="theaters" element={<TheaterManagement />} />
            <Route path="theaters/:theaterId/rooms" element={<RoomManagement />} />
            
            <Route path="showtimes" element={<ShowtimeManagement />} />
          </Route>
        </Route>
      </Routes>
      
      <Toaster richColors position="bottom-right" />
    </>
  )
}


export default App

