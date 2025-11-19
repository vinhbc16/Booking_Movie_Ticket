import api from "@/lib/axios"

/**
 * Lấy danh sách phòng của 1 rạp
 * @param {string} theaterId - ID của rạp
 * @param {object} params - { page: number, search: string }
 */
const getRooms = (theaterId, params) => {
  return api.get(`/theaters/${theaterId}/rooms`, { params })
}

/**
 * Tạo phòng mới
 * @param {string} theaterId - ID của rạp
 * @param {object} roomData - Dữ liệu phòng
 */
const createRoom = (theaterId, roomData) => {
  return api.post(`/theaters/${theaterId}/rooms`, roomData)
}

/**
 * Cập nhật phòng
 * @param {string} theaterId - ID rạp
 * @param {string} roomId - ID phòng
 * @param {object} roomData - Dữ liệu phòng
 */
const updateRoom = (theaterId, roomId, roomData) => {
  return api.put(`/theaters/${theaterId}/rooms/${roomId}`, roomData)
}

/**
 * Xóa phòng
 * @param {string} theaterId - ID rạp
 * @param {string} roomId - ID phòng
 */
const deleteRoom = (theaterId, roomId) => {
  return api.delete(`/theaters/${theaterId}/rooms/${roomId}`)
}


// Hàm mới để lấy TẤT CẢ phòng của 1 rạp (cho dropdown)
const getAllRooms = (theaterId) => {
  return api.get(`/theaters/${theaterId}/rooms`, { params: { limit: 1000 } })
}


export const roomService = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms
}