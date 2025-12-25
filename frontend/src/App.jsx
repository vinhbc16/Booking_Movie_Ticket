import React from "react";
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Loader2 } from "lucide-react";

import AuthPage from "@/features/auth/AuthPage";
import AdminProtectedRoute from "@/features/auth/components/AdminProtectedRoute";
import CustomerProtectedRoute from "@/features/auth/components/CustomerProtectedRoute";
import { useInitializeAuth } from "@/hooks/useInitializeAuth";
import { useAuthStore } from "@/store/useAuthStore";

import HomePage from "@/pages/HomePage";
import MoviesPage from "@/pages/MoviesPage";
import MovieDetailPage from "@/pages/MovieDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminLoginPage from "@/features/auth/AdminLoginPage";
import BookingPage from "@/pages/BookingPage";

import MovieManagement from "@/features/admin/movies/MovieManagement";
import TheaterManagement from "@/features/admin/theaters/TheaterManagement";
import RoomManagement from "@/features/admin/rooms/RoomManagement";
import ShowtimeManagement from "@/features/admin/showtimes/ShowtimeManagement";
import { CustomerLayout } from "./components/layout/customer/CustomerLayout";
import AdminLayout from "./components/layout/admin/AdminLayout";
import Dashboard from "@/features/admin/dashboard/DashboardManagement";
import DashboardManagement from "@/features/admin/dashboard/DashboardManagement";
import PaymentPage from "@/pages/PaymentPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import MyTicketsPage from "@/pages/MyTicketsPage";
import AdminUserPage from "@/features/admin/users/AdminUserPage";

function App() {
  useInitializeAuth();
  // Lấy trạng thái checking để hiển thị màn hình chờ
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  // Màn hình chờ khi F5 (Tránh chớp nháy giao diện Login)
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-sm text-gray-500 font-medium">
            Đang khởi động ứng dụng...
          </span>
        </div>
      </div>
    );
  }
  return (
    <>
      <Routes>
        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route element={<CustomerProtectedRoute />}>
          <Route path="/booking/:showtimeId" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} /> {/* Route Mới */}
          <Route
            path="/payment/success"
            element={<PaymentSuccessPage />}
          />{" "}
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          {/* Route Mới */}
        </Route>

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

            {/* 2. Route Con: /admin/dashboard */}
            <Route path="dashboard" element={<DashboardManagement />} />
            {/* Nested Route cho Room */}
            <Route path="theaters" element={<TheaterManagement />} />
            <Route
              path="theaters/:theaterId/rooms"
              element={<RoomManagement />}
            />

            <Route path="showtimes" element={<ShowtimeManagement />} />
            <Route path="users" element={<AdminUserPage />} />
          </Route>
        </Route>
      </Routes>

      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;
