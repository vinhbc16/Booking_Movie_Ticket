import api from "@/lib/axios"

export const bookingService = {
  createBooking: (data) => {
    // data gồm: { showtimeId, seats: ['A1', 'A2'] }
    return api.post('/bookings', data)
  },
  
  getBookingDetail: (id) => {
    return api.get(`/bookings/${id}`)
  },
  
  getMyBookings: () => api.get('/bookings/mine'),
}