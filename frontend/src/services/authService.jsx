import api from "@/lib/axios"

// Customer APIs
const customerLogin = (credentials) => api.post("/auth/login", credentials)
const customerRegister = (userData) => api.post("/auth/register", userData)
const customerLogout = () => api.post("/auth/logout")

// Admin APIs
const adminLogin = (credentials) => api.post("/admin/auth/login", credentials)
const adminLogout = () => api.post("/admin/auth/logout") // Lưu ý backend phải có route này

export const authService = {
  customerLogin,
  customerRegister,
  customerLogout,
  adminLogin,
  adminLogout,
}