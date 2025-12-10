import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/axios'

export function useInitializeAuth() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)
  const finishChecking = useAuthStore((state) => state.finishChecking)
  
  // Dùng ref để tránh React 18 chạy 2 lần ở StrictMode gây nhiễu log
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const checkAuth = async () => {
      console.log("🔄 [Auth Debug] Bắt đầu khôi phục phiên đăng nhập...");
      
      try {
        // Log xem URL gọi là gì
        console.log("📡 [Auth Debug] Gọi API: POST /auth/refresh-token");
        
        const res = await api.post('/auth/refresh-token')
        
        console.log("✅ [Auth Debug] Refresh thành công!", res.data);
        
        const { user, accessToken } = res.data
        setAuth(user, accessToken)
        console.log("💾 [Auth Debug] Đã lưu Token mới vào Zustand Store");

      } catch (error) {
        console.error("❌ [Auth Debug] Lỗi khi refresh token:", error);
        
        if (error.response) {
            // Lỗi từ backend trả về (401, 403...)
            console.log("⚠️ [Auth Debug] Status:", error.response.status);
            console.log("⚠️ [Auth Debug] Data:", error.response.data);
        } else {
            // Lỗi mạng hoặc config
            console.log("⚠️ [Auth Debug] Network/Config Error");
        }

        // Nếu lỗi, xóa sạch thông tin cũ để tránh xung đột
        logout() 
      } finally {
        console.log("🏁 [Auth Debug] Kết thúc kiểm tra Auth -> Tắt màn hình loading");
        finishChecking()
      }
    }

    checkAuth()
  }, [])
}