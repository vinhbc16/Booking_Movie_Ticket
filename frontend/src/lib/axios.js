import axios from "axios"
import { useAuthStore } from "@/store/useAuthStore"

const BASE_URL = "http://localhost:3000/api/v1"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // BẮT BUỘC: Để gửi Cookie RefreshToken đi
})

// 1. Request Interceptor: Gắn Access Token từ RAM vào Header
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 2. Response Interceptor: Tự động Refresh khi lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Nếu lỗi 401 và chưa từng thử lại
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh-token')) {
      originalRequest._retry = true 

      try {
        // Gọi API Refresh Token (Cookie refreshToken sẽ tự động gửi kèm)
        // Lưu ý: Gọi vào route chung của customer vì chúng ta đã gộp logic refresh
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
            withCredentials: true 
        })

        const { accessToken, user } = res.data 

        // 1. Cập nhật Token mới vào Store
        useAuthStore.getState().setAuth(user, accessToken)

        // 2. Gắn Token mới vào header request cũ
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`

        // 3. Thực hiện lại request cũ
        return api(originalRequest)

      } catch (refreshError) {
        // Refresh thất bại (Cookie hết hạn/không hợp lệ) -> Logout
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api