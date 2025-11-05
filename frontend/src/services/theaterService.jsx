import api from "@/lib/axios" // Dùng axios instance đã có interceptor

/**
 * Lấy danh sách rạp (có phân trang/tìm kiếm)
 * @param {object} params - { page: number, search: string }
 */
const getTheaters = (params) => {
  return api.get('/theaters', { params })
}

/**
 * Tạo rạp mới
 * @param {object} theaterData - { name, address }
 */
const createTheater = (theaterData) => {
  return api.post('/theaters', theaterData)
}

/**
 * Cập nhật rạp
 * @param {string} id - ID của rạp
 * @param {object} theaterData - { name, address }
 */
const updateTheater = (id, theaterData) => {
  return api.put(`/theaters/${id}`, theaterData)
}

/**
 * Xóa rạp
 * @param {string} id - ID của rạp
 */
const deleteTheater = (id) => {
  return api.delete(`/theaters/${id}`)
}

export const theaterService = {
  getTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
}