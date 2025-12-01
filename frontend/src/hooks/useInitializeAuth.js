import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import api from '@/lib/axios'

export function useInitializeAuth() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)
  const finishChecking = useAuthStore((state) => state.finishChecking)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Gọi API refresh để lấy lại Token & User Info từ Cookie
        const res = await api.post('/auth/refresh-token') 
        
        const { user, accessToken } = res.data
        setAuth(user, accessToken)
      } catch (error) {
        // Không có cookie hoặc hết hạn -> coi như chưa đăng nhập
        logout()
      } finally {
        finishChecking()
      }
    }

    checkAuth()
  }, [])
}