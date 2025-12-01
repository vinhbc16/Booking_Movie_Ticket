import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null, // Chỉ nằm trong RAM (Memory)
      isAuthenticated: false,
      isCheckingAuth: true, // Trạng thái đang check khi F5

      // Đăng nhập: Lưu token vào RAM, user info vào LocalStorage
      setAuth: (user, token) => {
        set({ 
          user, 
          accessToken: token, 
          isAuthenticated: true,
          isCheckingAuth: false
        })
      },

      // Cập nhật token mới (khi refresh thành công)
      setAccessToken: (token) => {
        set({ accessToken: token })
      },

      // Đăng xuất: Xóa sạch
      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false,
          isCheckingAuth: false
        })
      },
      
      // Kết thúc quá trình check (dùng khi F5 xong mà ko có user)
      finishChecking: () => set({ isCheckingAuth: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Chỉ lưu User Info
    }
  )
)