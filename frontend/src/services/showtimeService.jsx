import api from "@/lib/axios"


const ADMIN_ENDPOINT = '/admin/showtimes'
const PUBLIC_ENDPOINT = '/showtimes'

/**
 * Lấy danh sách suất chiếu cho Admin (theo rạp và ngày)
 * @param {object} params - { theaterId: string, date: string (yyyy-MM-dd) }
 */
const getAll = (params) => {
  return api.get(ADMIN_ENDPOINT, { params })
}

/**
 * Tạo suất chiếu mới
 * @param {object} data - { movie, room, basePrice, startTime }
 */
const create = (data) => {
  return api.post(ADMIN_ENDPOINT, data)
}

/**
 * Xóa suất chiếu
 * @param {string} id - ID suất chiếu
 */
const deleteShowtime = (id) => {
  return api.delete(`${ADMIN_ENDPOINT}/${id}`)
}

/**
 * Lấy suất chiếu public (cho trang chi tiết phim)
 * @param {object} params - { movieId, date (yyyy-MM-dd) }
 */
const getShowtimesByMovie = (params) => {
  return api.get(PUBLIC_ENDPOINT, { params })
}

const getShowtimeDetail = (id) => {
  return api.get(`${PUBLIC_ENDPOINT}/${id}`)
}

export const showtimeService = {
  getAll,
  create,
  deleteShowtime,
  getShowtimesByMovie,
  getShowtimeDetail
}