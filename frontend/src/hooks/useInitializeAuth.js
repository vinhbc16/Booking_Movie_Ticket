import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/axios'

export function useInitializeAuth() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)
  const finishChecking = useAuthStore((state) => state.finishChecking)
  
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const checkAuth = async () => {
      try {
        // Gọi API refresh token âm thầm
        const res = await api.post('/auth/refresh-token')
        const { user, accessToken } = res.data
        
        // Kiểm tra an toàn lần cuối
        if (typeof accessToken === 'string') {
            setAuth(user, accessToken)
        } else {
            // Chỉ log nếu dữ liệu sai định dạng nghiêm trọng
            console.error("Token format error");
            logout();
        }

      } catch (error) {
        // Không cần log lỗi 401/403 ra console quá nhiều vì đây là hành vi bình thường khi chưa login
        // Chỉ logout để reset state
        logout() 
      } finally {
        finishChecking()
      }
    }

    checkAuth()
  }, [])
}