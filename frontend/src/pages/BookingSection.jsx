import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { format, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { MapPin, ChevronDown, ChevronUp, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { showtimeService } from '@/services/showtimeService'
import { cn } from '@/lib/utils'

// 👇 1. IMPORT TOOLTIP TỪ SHADCN
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BookingSection({ movieId }) {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showtimes, setShowtimes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  // State cho bộ lọc rạp và accordion
  const [selectedTheaterFilter, setSelectedTheaterFilter] = useState('all')
  const [expandedTheaters, setExpandedTheaters] = useState({}) 

  // 1. Tạo danh sách 14 ngày
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  // 2. Fetch suất chiếu
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
        
        setSelectedTheaterFilter('all')
        setExpandedTheaters({})
      } catch (error) {
        console.error("Lỗi tải lịch chiếu:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchShowtimes()
  }, [selectedDate, movieId])

  // 3. Logic Nhóm dữ liệu
  const groupedData = showtimes.reduce((acc, st) => {
    const tId = st.theaterId
    if (!acc[tId]) {
      acc[tId] = {
        info: {
          id: tId,
          name: st.theaterName,
          address: st.theaterAddress,
        },
        showtimes: []
      }
    }
    acc[tId].showtimes.push(st)
    return acc
  }, {})

  const toggleTheater = (theaterId) => {
    setExpandedTheaters(prev => ({
      ...prev,
      [theaterId]: !prev[theaterId]
    }))
  }

  const displayedTheaters = selectedTheaterFilter === 'all' 
    ? Object.values(groupedData)
    : Object.values(groupedData).filter(g => g.info.id === selectedTheaterFilter)

  const formatTime = (dateStr) => format(new Date(dateStr), 'HH:mm')

  return (
    <div className="space-y-8">
      
      {/* --- A. DATE SELECTOR --- */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map((date) => {
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
          return (
            <button
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={`flex min-w-[90px] flex-col items-center justify-center rounded-lg border px-2 py-2 transition-all ${
                isSelected 
                  ? 'bg-red-50 border-red-500 text-red-600 font-bold shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'
              }`}
            >
              <span className="text-xs capitalize mb-1">
                {format(date, 'EEEE', { locale: vi })}
              </span>
              <span className="text-lg">
                {format(date, 'dd/MM')}
              </span>
            </button>
          )
        })}
      </div>

      {/* --- B. THEATER FILTER --- */}
      {Object.keys(groupedData).length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 border-b border-dashed border-gray-200">
          <button
            onClick={() => setSelectedTheaterFilter('all')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors",
              selectedTheaterFilter === 'all' 
                ? "bg-primary text-white border-primary" 
                : "bg-white text-gray-600 border-gray-300 hover:border-primary"
            )}
          >
            <Film className="w-4 h-4" />
            Tất cả rạp
          </button>

          {Object.values(groupedData).map(group => (
            <button
              key={group.info.id}
              onClick={() => {
                setSelectedTheaterFilter(group.info.id)
                setExpandedTheaters({ [group.info.id]: true })
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors",
                selectedTheaterFilter === group.info.id 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white text-gray-600 border-gray-300 hover:border-primary"
              )}
            >
              <span>{group.info.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* --- C. THEATER LIST --- */}
      <div className="space-y-4">
        {isLoading ? (
           <div className="text-center text-gray-500 py-10">Đang tải lịch chiếu...</div>
        ) : displayedTheaters.length > 0 ? (
          displayedTheaters.map((group) => {
            const isOpen = expandedTheaters[group.info.id]
            const uniqueRoomTypes = [...new Set(group.showtimes.map(s => s.roomType))]

            return (
              <div key={group.info.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
                
                {/* Header Rạp */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer bg-gray-50/50 hover:bg-gray-100/80 transition-colors"
                  onClick={() => toggleTheater(group.info.id)}
                >
                  <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-green-100 text-green-700 font-bold text-xs border border-green-200">
                        {group.info.name.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                          {group.info.name}
                          <span className="text-xs font-normal text-gray-400">({group.showtimes.length} suất)</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                           <MapPin className="w-3 h-3" /> {group.info.address}
                        </p>
                      </div>
                  </div>
                  {isOpen ? <ChevronUp className="text-gray-400 w-5 h-5" /> : <ChevronDown className="text-gray-400 w-5 h-5" />}
                </div>

                {/* Nội dung Suất chiếu */}
                {isOpen && (
                  <div className="p-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    {uniqueRoomTypes.map(type => (
                      <div key={type} className="mb-4 last:mb-0">
                        <div className="mb-3 flex items-center gap-2">
                           <Badge variant="secondary" className="bg-transparent border border-gray-300 text-gray-700 rounded-sm px-2 font-semibold">
                              {type}
                           </Badge>
                           <span className="text-xs text-gray-400">Phụ đề tiếng Việt</span>
                        </div>

                        {/* 👇 2. CẬP NHẬT LOGIC TOOLTIP & DISABLE Ở ĐÂY */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                          {group.showtimes
                            .filter(st => st.roomType === type)
                            .map((st) => (
                              <TooltipProvider key={st._id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            // Vô hiệu hóa nếu hết ghế
                                            disabled={st.availableSeats === 0}
                                            onClick={() => navigate(`/booking/${st._id}`)}
                                            className={cn(
                                                "w-full h-auto py-2 px-1 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 flex flex-col gap-0.5",
                                                // Style cho trạng thái hết vé
                                                st.availableSeats === 0 && "opacity-50 cursor-not-allowed bg-gray-100 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-400"
                                            )}
                                        >
                                            <span className="text-sm font-bold tracking-tight">
                                                {formatTime(st.startTime)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-normal">
                                                ~{formatTime(st.endTime)}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>

                                    {/* Tooltip Content */}
                                    <TooltipContent className="bg-slate-800 text-white border-slate-700">
                                        <div className="text-center">
                                            <p className="font-bold text-sm mb-1">{st.room}</p>
                                            <div className="text-xs text-gray-300">
                                                Ghế trống: <span className={cn(
                                                    "font-bold", 
                                                    st.availableSeats > 10 ? "text-green-400" : "text-red-400"
                                                )}>
                                                    {st.availableSeats}
                                                </span> 
                                                <span className="mx-1">/</span> 
                                                {st.totalSeats}
                                            </div>
                                            {st.availableSeats === 0 && (
                                                <p className="text-[10px] text-red-500 mt-1 uppercase font-bold">Đã hết vé</p>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50/50">
            <Film className="mx-auto h-12 w-12 text-gray-300 mb-3" />
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