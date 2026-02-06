import axios from "axios"
import { useAuthStore } from "@/store/useAuthStore" // Import Store

const BASE_URL = "http://localhost:3000/api/v1"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // To send refreshToken cookie
  headers: {
    "Content-Type": "application/json",
  },
})

// 1. REQUEST INTERCEPTOR (Added to fix F5 issue)
// Before sending request, always get the latest token from Store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    // --- FIX CODE ---
    if (token) {
        // 1. If token is a standard String -> Use it
        if (typeof token === 'string') {
            config.headers["Authorization"] = `Bearer ${token}`;
        } 
        // 2. If token is Object (error case {}) -> Try to get string inside
        else if (typeof token === 'object') {
            console.warn("Warning: Token saved in wrong Object format:", token);
            
            // If object has accessToken key, use it
            if (token.accessToken && typeof token.accessToken === 'string') {
                config.headers["Authorization"] = `Bearer ${token.accessToken}`;
            } 
            // If empty object {} -> Don't send header (treat as not logged in)
        }
    }
    // -------------------------

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR (Keep existing logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    // Existing refresh token logic...
    if (
        error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true 
      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true })
        const { accessToken, user } = res.data 
        
        // Update store
        useAuthStore.getState().setAuth(user, accessToken)
        
        // Attach new token to failed request and retry
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