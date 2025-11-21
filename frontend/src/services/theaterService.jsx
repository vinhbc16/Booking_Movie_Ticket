import api from "@/lib/axios" // Dùng axios instance đã có interceptor

const ADMIN_ENDPOINT = '/admin/theaters'
const PUBLIC_ENDPOINT = '/theaters'

/**
 * Lấy danh sách rạp (có phân trang/tìm kiếm)
 * @param {object} params - { page: number, search: string }
 */
const getTheaters = (params) => {
  return api.get(ADMIN_ENDPOINT, { params })
}

/**
 * Tạo rạp mới
 * @param {object} theaterData - { name, address }
 */
const createTheater = (theaterData) => {
  return api.post(ADMIN_ENDPOINT, theaterData)
}

/**
 * Cập nhật rạp
 * @param {string} id - ID của rạp
 * @param {object} theaterData - { name, address }
 */
const updateTheater = (id, theaterData) => {
  return api.put(`${ADMIN_ENDPOINT}/${id}`, theaterData)
}

/**
 * Xóa rạp
 * @param {string} id - ID của rạp
 */
const deleteTheater = (id) => {
  return api.delete(`${ADMIN_ENDPOINT}/${id}`)
}

/**
 * Lấy 1 rạp cụ thể
 * @param {string} id - ID của rạp
 */
const getTheater = (id) => {
  return api.get(`${ADMIN_ENDPOINT}/${id}`)
}

export const theaterService = {
  getTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
  getTheater
}