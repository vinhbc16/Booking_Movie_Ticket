import api from "@/lib/axios" // Sử dụng axios instance đã có interceptor

const ADMIN_ENDPOINT = '/admin/movies'
const PUBLIC_ENDPOINT = '/movies'

/**
 * Lấy danh sách phim có phân trang và tìm kiếm
 * @param {object} params - { page: number, search: string }
 */
const getMovies = (params) => {
  // api.get('/movies', { params: { page: 1, search: 'ten' } })
  // sẽ gọi -> http://localhost:3000/api/v1/movies?page=1&search=ten
  return api.get(ADMIN_ENDPOINT, { params })
}

/**
 * Tạo phim mới
 * @param {object} movieData - Dữ liệu phim từ form
 */
const createMovie = (movieData) => {
  // Gửi token tự động nhờ axios interceptor
  return api.post(ADMIN_ENDPOINT, movieData)
}

/**
 * Cập nhật phim
 * @param {string} id - ID của phim
 * @param {object} movieData - Dữ liệu phim từ form
 */
const updateMovie = (id, movieData) => {
  return api.put(`${ADMIN_ENDPOINT}/${id}`, movieData)
}

/**
 * Xóa phim
 * @param {string} id - ID của phim
 */
const deleteMovie = (id) => {
  return api.delete(`${ADMIN_ENDPOINT}/${id}`)
}


// Hàm mới để lấy TẤT CẢ phim cho dropdown
const getAllMovies = () => {
  // Lấy 1000 phim (coi như là tất cả)
  return api.get(ADMIN_ENDPOINT, { params: { limit: 1000 } }) 
}

const getFeaturedMovies = () => {
  return api.get('/featured-movies') 
}

const getShowingMovies = () => {
  return api.get('/movies', { 
    params: { 
      status: 'showing', // Lọc theo phim đang chiếu
      limit: 8           // Lấy 8 phim để hiển thị đẹp grid
    } 
  })
}

const getComingSoonMovies = () => {
  return api.get(PUBLIC_ENDPOINT, { 
    params: { status: 'coming_soon', limit: 12 }
  })
}

const searchMovies = (query) => {
  return api.get(PUBLIC_ENDPOINT, {
    params: {
      search: query,
      limit: 5 // Chỉ lấy 5 kết quả gợi ý cho nhẹ
    }
  })
}

/**
 * [PUBLIC] Lấy danh sách phim công khai với bộ lọc
 * @param {object} params - { status, genre, search, page, limit }
 */
const getPublicMovies = (params) => {
  return api.get(PUBLIC_ENDPOINT, { params })
}

const getMovieDetail = (id) => {
  return api.get(`${PUBLIC_ENDPOINT}/${id}`)
}


export const movieService = {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getFeaturedMovies,
  getShowingMovies,
  searchMovies,
  getComingSoonMovies,
  getPublicMovies,
  getMovieDetail
}