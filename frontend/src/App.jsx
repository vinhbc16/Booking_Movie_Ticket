import React from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter , Routes , Route , Navigate } from "react-router"

// 2. Features (Đường dẫn mới)
// Auth
import AuthPage from "@/features/auth/AuthPage"
import AdminProtectedRoute from "@/features/auth/components/AdminProtectedRoute"

// Customer Pages (Vẫn giữ ở pages vì chưa refactor feature home, hoặc bạn có thể chuyển nốt)
import HomePage from "@/pages/HomePage" 

// Admin Features
import MovieManagement from "@/features/admin/movies/MovieManagement"
import TheaterManagement from "@/features/admin/theaters/TheaterManagement"
import RoomManagement from "@/features/admin/rooms/RoomManagement"
import ShowtimeManagement from "@/features/admin/showtimes/ShowtimeManagement"

import { CustomerLayout } from './components/layout/customer/CustomerLayout'
import AdminLayout from './components/layout/admin/AdminLayout'



function App() {
  return (
    <>
      <Routes>
        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Auth Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            
            <Route path="movies" element={<MovieManagement />} />
            
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

