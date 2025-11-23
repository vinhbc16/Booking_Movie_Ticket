import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { format, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { showtimeService } from '@/services/showtimeService'

export function BookingSection({ movieId }) {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showtimes, setShowtimes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // 1. Tạo danh sách 14 ngày tiếp theo
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  // 2. Fetch suất chiếu khi chọn ngày
  useEffect(() => {
    if (!movieId) return

    const fetchShowtimes = async () => {
      setIsLoading(true)
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const res = await showtimeService.getShowtimesByMovie({ 
            movieId, 
            date: dateStr 
        })
        setShowtimes(res.data.showtimesList || [])
      } catch (error) {
        console.error("Lỗi tải lịch chiếu:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShowtimes()
  }, [selectedDate, movieId])

  // 3. Hàm nhóm suất chiếu theo Rạp (Grouping)
  const groupShowtimesByTheater = (showtimes) => {
    const groups = {}
    showtimes.forEach(st => {
      const theaterName = st.theaterName
      if (!groups[theaterName]) {
        groups[theaterName] = []
      }
      groups[theaterName].push(st)
    })
    return groups
  }

  const groupedShowtimes = groupShowtimesByTheater(showtimes)

  // Hàm format giờ
  const formatTime = (dateStr) => {
    return format(new Date(dateStr), 'HH:mm')
  }

  return (
    <div className="space-y-8">
      
      {/* --- DATE SELECTOR --- */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {dates.map((date) => {
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
          return (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={`flex min-w-[80px] flex-col items-center justify-center rounded-xl border px-4 py-3 transition-all hover:border-[#F5C518] ${
                isSelected 
                  ? 'bg-[#F5C518] border-[#F5C518] text-black shadow-md scale-105' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-yellow-50'
              }`}
            >
              <span className="text-xs font-medium uppercase">
                {format(date, 'EEE', { locale: vi })}
              </span>
              <span className="text-xl font-bold">
                {format(date, 'dd')}
              </span>
            </button>
          )
        })}
      </div>

      {/* --- THEATER LIST --- */}
      <div className="space-y-6">
        {isLoading ? (
           <div className="text-center text-gray-500 py-10">Đang tải lịch chiếu...</div>
        ) : Object.keys(groupedShowtimes).length > 0 ? (
          Object.entries(groupedShowtimes).map(([theaterName, times]) => (
            <div key={theaterName} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              
              {/* Tên Rạp */}
              <div className="mb-4 flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <MapPin className="h-6 w-6" />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-gray-900">{theaterName}</h3>
                      <p className="text-sm text-gray-500">2D Phụ đề</p> {/* Có thể thay bằng địa chỉ */}
                   </div>
                </div>
              </div>

              {/* Danh sách Giờ chiếu */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {times.map((st) => {
                   const availableSeats = st.totalSeats - st.bookedSeats
                   return (
                    <div key={st._id} className="group relative">
                      <Button
                        variant="outline"
                        className="h-auto w-full flex-col gap-1 py-3 border-gray-300 hover:border-[#F5C518] hover:bg-yellow-50 hover:text-black"
                        onClick={() => navigate(`/booking/${st._id}`)}
                      >
                        <span className="text-lg font-bold tracking-wide">
                          {formatTime(st.startTime)}
                        </span>
                        <span className="text-xs text-gray-400 font-normal">
                          ~ {formatTime(st.endTime)}
                        </span>
                      </Button>
                      
                      {/* Tooltip số ghế trống (Chỉ hiện khi hover) */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                         <Badge className="bg-black text-white text-[10px] whitespace-nowrap">
                            Còn {availableSeats} ghế
                         </Badge>
                      </div>
                    </div>
                   )
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-500">
              Chưa có lịch chiếu cho ngày này
            </p>
            <p className="text-sm text-gray-400">Vui lòng chọn ngày khác</p>
          </div>
        )}
      </div>
    </div>
  )
}