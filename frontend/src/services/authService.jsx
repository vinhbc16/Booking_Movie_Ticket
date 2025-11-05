import api from "@/lib/axios"

/**
 * Gửi request đăng nhập
 * @param {object} credentials - { email, password }
 */
const login = (credentials) => {
  return api.post("/auth/login", credentials)
}

/**
 * Gửi request đăng ký
 * @param {object} userData - { username, email, password, phone }
 */
const register = (userData) => {
  return api.post("/auth/register", userData)
}

export const authService = {
  login,
  register,
}