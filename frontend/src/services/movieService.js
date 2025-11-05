import api from "@/lib/axios" // Sử dụng axios instance đã có interceptor

/**
 * Lấy danh sách phim có phân trang và tìm kiếm
 * @param {object} params - { page: number, search: string }
 */
const getMovies = (params) => {
  // api.get('/movies', { params: { page: 1, search: 'ten' } })
  // sẽ gọi -> http://localhost:3000/api/v1/movies?page=1&search=ten
  return api.get('/movies', { params })
}

/**
 * Tạo phim mới
 * @param {object} movieData - Dữ liệu phim từ form
 */
const createMovie = (movieData) => {
  // Gửi token tự động nhờ axios interceptor
  return api.post('/movies', movieData)
}

/**
 * Cập nhật phim
 * @param {string} id - ID của phim
 * @param {object} movieData - Dữ liệu phim từ form
 */
const updateMovie = (id, movieData) => {
  return api.put(`/movies/${id}`, movieData)
}

/**
 * Xóa phim
 * @param {string} id - ID của phim
 */
const deleteMovie = (id) => {
  return api.delete(`/movies/${id}`)
}

export const movieService = {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
}