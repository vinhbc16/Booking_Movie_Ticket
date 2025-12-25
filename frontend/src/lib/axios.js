import axios from "axios"
import { useAuthStore } from "@/store/useAuthStore" // Import Store

const BASE_URL = "http://localhost:3000/api/v1"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Để gửi kèm cookie refreshToken
  headers: {
    "Content-Type": "application/json",
  },
})

// 🚀 1. REQUEST INTERCEPTOR (Thêm đoạn này để fix lỗi F5)
// Trước khi gửi request đi, luôn lấy token mới nhất từ Store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    // --- ĐOẠN CODE FIX LỖI ---
    if (token) {
        // 1. Nếu token là String chuẩn -> Dùng luôn
        if (typeof token === 'string') {
            config.headers["Authorization"] = `Bearer ${token}`;
        } 
        // 2. Nếu token là Object (lỗi bạn đang gặp {}) -> Cố gắng lấy string bên trong
        else if (typeof token === 'object') {
            console.warn("⚠️ Token bị lưu sai định dạng Object:", token);
            
            // Nếu trong object có key accessToken thì lấy nó
            if (token.accessToken && typeof token.accessToken === 'string') {
                config.headers["Authorization"] = `Bearer ${token.accessToken}`;
            } 
            // Nếu là object rỗng {} thì KHÔNG gửi header (coi như chưa login)
        }
    }
    // -------------------------

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR (Giữ nguyên logic cũ của bạn)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    // Logic refresh token cũ của bạn...
    if (
        error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true 
      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true })
        const { accessToken, user } = res.data 
        
        // Cập nhật store
        useAuthStore.getState().setAuth(user, accessToken)
        
        // Gắn token mới vào request đang bị lỗi và gửi lại
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api