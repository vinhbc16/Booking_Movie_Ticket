import api from "@/lib/axios"

/**
 * Lấy danh sách suất chiếu cho Admin (theo rạp và ngày)
 * @param {object} params - { theaterId: string, date: string (yyyy-MM-dd) }
 */
const getAll = (params) => {
  return api.get('/showtimes/admin', { params })
}

/**
 * Tạo suất chiếu mới
 * @param {object} data - { movie, room, basePrice, startTime }
 */
const create = (data) => {
  return api.post('/showtimes', data)
}

/**
 * Xóa suất chiếu
 * @param {string} id - ID suất chiếu
 */
const deleteShowtime = (id) => {
  return api.delete(`/showtimes/${id}`)
}

export const showtimeService = {
  getAll,
  create,
  deleteShowtime,
}