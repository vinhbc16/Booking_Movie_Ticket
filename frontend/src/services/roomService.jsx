import api from "@/lib/axios"

// Helper để tạo URL chuẩn: /admin/theaters/:id/rooms
const getBaseUrl = (theaterId) => `/admin/theaters/${theaterId}/rooms`

/**
 * Lấy danh sách phòng của một rạp cụ thể
 * @param {string} theaterId - ID của rạp (Bắt buộc)
 * @param {object} params - { page, search, limit }
 */
const getRooms = (theaterId, params) => {
  if (!theaterId) throw new Error("Theater ID is required")
  return api.get(getBaseUrl(theaterId), { params })
}

/**
 * Tạo phòng mới cho một rạp
 * @param {string} theaterId - ID của rạp
 * @param {object} roomData - Dữ liệu phòng { name, numberOfRows, ... }
 */
const createRoom = (theaterId, roomData) => {
  if (!theaterId) throw new Error("Theater ID is required")
  // Backend của bạn đã sửa để lấy theaterId từ URL, nên body chỉ cần data phòng
  return api.post(getBaseUrl(theaterId), roomData)
}

/**
 * Cập nhật phòng
 * URL Backend: /admin/theaters/:theaterID/rooms/:roomID
 */
const updateRoom = (theaterId, roomId, roomData) => {
  if (!theaterId || !roomId) throw new Error("IDs are required")
  return api.put(`${getBaseUrl(theaterId)}/${roomId}`, roomData)
}

/**
 * Xóa phòng
 * URL Backend: /admin/theaters/:theaterID/rooms/:roomID
 */
const deleteRoom = (theaterId, roomId) => {
  if (!theaterId || !roomId) throw new Error("IDs are required")
  return api.delete(`${getBaseUrl(theaterId)}/${roomId}`)
}

/**
 * Lấy tất cả phòng của rạp để đổ vào dropdown (khi tạo suất chiếu)
 */
const getAllRooms = (theaterId) => {
  if (!theaterId) return Promise.resolve({ data: { roomsList: [] } })
  return api.get(getBaseUrl(theaterId), { params: { limit: 1000 } })
}

export const roomService = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms
}