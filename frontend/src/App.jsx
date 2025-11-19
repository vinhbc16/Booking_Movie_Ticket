import React from 'react'
import { Toaster } from 'sonner'
import { BrowserRouter , Routes , Route , Navigate } from "react-router"
import AuthPage from "./pages/AuthPage"

// Import các component mới
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import { CustomerLayout } from "./components/layout/CustomerLayout" // 1. Import
import Dashboard from "./pages/admin/Dashboard"
import MovieManagement from "./pages/admin/MovieManagement"
import TheaterManagement from "./pages/admin/TheaterManagement"
import ShowtimeManagement from "./pages/admin/ShowtimeManagement"
import RoomManagement from "./pages/admin/RoomManagement"
import UserManagement from "./pages/admin/UserManagement"
import HomePage from "./pages/HomePage" // 2. Đổi tên import

// function HomePage() {
//   return (
    
//     <div className="min-h-screen w-full relative bg-white">
//   {/* Teal Glow Left */}
//       <h1 className="p-10 text-3xl">Đây là trang chủ</h1>
//   <div
//     className="absolute inset-0 z-0"
//     style={{
//       background: "#ffffff",
//       backgroundImage: `
//         radial-gradient(
//           circle at top left,
//           rgba(56, 193, 182, 0.5),
//           transparent 70%
//         )
//       `,
//       filter: "blur(80px)",
//       backgroundRepeat: "no-repeat",
//     }}
//   />
//      {/* Your Content/Components */}
// </div>

//   )
// }

function App() {
  return (
    <>
      <Routes>

        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* (Thêm các route khách hàng khác ở đây, vd: /movies, /theaters) */}
        </Route>

        <Route path="/auth" element={<AuthPage />} />
        

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Route index: /admin -> /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="movies" element={<MovieManagement />} />
            <Route path="theaters" element={<TheaterManagement />} />
            <Route path="theaters/:theaterId/rooms" element={<RoomManagement />} />
            <Route path="showtimes" element={<ShowtimeManagement />} />
            {/* <Route path="rooms" element={<RoomManagement />} /> */}
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

