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
        // Call refresh token API silently
        const res = await api.post('/auth/refresh-token')
        const { user, accessToken } = res.data
        
        // Final safety check
        if (typeof accessToken === 'string') {
            setAuth(user, accessToken)
        } else {
            // Only log if data format is seriously wrong
            console.error("Token format error");
            logout();
        }

      } catch (error) {
        // No need to log 401/403 errors as this is normal behavior when not logged in
        // Just logout to reset state
        logout() 
      } finally {
        finishChecking()
      }
    }

    checkAuth()
  }, [])
}