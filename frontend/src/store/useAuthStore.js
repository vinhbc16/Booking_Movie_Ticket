import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null, // Only stored in RAM (Memory)
      isAuthenticated: false,
      isCheckingAuth: true, // Checking state on F5

      // Login: Store token in RAM, user info in LocalStorage
      setAuth: (user, token) => {
        set({ 
          user, 
          accessToken: token, 
          isAuthenticated: true,
          isCheckingAuth: false
        })
      },

      // Update new token (when refresh succeeds)
      setAccessToken: (token) => {
        set({ accessToken: token })
      },

      // Logout: Clear everything
      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false,
          isCheckingAuth: false
        })
      },
      
      // Finish checking process (used when F5 completes with no user)
      finishChecking: () => set({ isCheckingAuth: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Only store User Info
    }
  )
)