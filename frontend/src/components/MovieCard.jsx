import React from 'react'
import { useNavigate } from 'react-router'
import { Clock, Play, Calendar } from 'lucide-react' // Thêm icon Calendar
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion' // 1. Import

// Helper format ngày khởi chiếu
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

export function MovieCard({ movie , index }) {
  const navigate = useNavigate()
  
  const displayGenres = Array.isArray(movie.genre) 
    ? movie.genre.slice(0, 2).join(', ') 
    : movie.genre

  const isShowing = movie.status === 'showing'

  // Hàm xử lý khi ấn Đặt vé
  const handleBookTicket = (e) => {
    e.stopPropagation() // Ngăn click vào card
    // Chuyển đến trang chi tiết, kèm theo trạng thái "scrollToBooking"
    navigate(`/movie/${movie._id}`, { state: { scrollToBooking: true } })
  }

  return (
    <motion.div 
    // Trạng thái ban đầu: mờ và nằm thấp xuống 50px
      initial={{ opacity: 0, y: 60 }}
      
      // Khi cuộn tới (vào tầm nhìn): hiện rõ và trồi lên vị trí gốc
      whileInView={{ opacity: 1, y: 0.5 }}
      
      // Cấu hình viewport: once: true (chỉ chạy 1 lần đầu, cuộn lên không bị ẩn đi lại)
      viewport={{ once: true, margin: "-50px" }}
      
      // Thời gian chạy: delay dựa theo index (nếu có) để các card hiện so le nhau
      transition={{ duration: 0.5, delay: index ? index * 0.1 : 0 }}
    className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100">
      
      {/* --- 1. POSTER --- */}
      <div className="relative aspect-[2/3] overflow-hidden cursor-pointer" onClick={() => navigate(`/movie/${movie._id}`)}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay khi hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Nút Play icon giữa ảnh (Optional - nếu bạn muốn giữ)
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 scale-75 group-hover:scale-100">
           <div className="rounded-full bg-[#F5C518] p-3 shadow-lg transition-transform hover:scale-110">
             <Play className="h-6 w-6 fill-black text-black" />
           </div>
        </div> */}

        {/* Badge Tuổi */}
        <Badge className={`absolute left-2 top-2 border-none px-2 py-1 text-xs font-bold shadow-sm ${
            movie.ageRating === 'C18' ? 'bg-red-600' : 'bg-[#F5C518] text-black'
        }`}>
          {movie.ageRating}
        </Badge>
      </div>

      {/* --- 2. CONTENT --- */}
      <div className="flex flex-1 flex-col p-3">
        {/* Tên phim */}
        <h3 
          className="mb-1 line-clamp-2 text-base font-bold uppercase text-gray-800 transition-colors cursor-pointer min-h-[3rem]"
          onClick={() => navigate(`/movie/${movie._id}`)}
          title={movie.title}
        >
          {movie.title}
        </h3>

        {/* Thể loại */}
        <p className="mb-3 line-clamp-1 text-xs text-gray-500">
          {displayGenres}
        </p>

        {/* Footer Card */}
        <div className="mt-auto pt-2 border-t border-gray-50">
          
          {isShowing ? (
            <div className="flex items-center justify-between gap-2">
               {/* Thời lượng (Chỉ hiện khi đang chiếu để tiết kiệm chỗ) */}
               <div className="flex items-center text-xs font-medium text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {movie.duration}'
               </div>

               {/* Nút Đặt vé (Màu vàng #F5C518) */}
               <Button 
                 size="sm" 
                 className="h-8 px-4 text-xs font-bold text-[#f5f5f6] bg-[#4176e8] hover:bg-[#0654fc] shadow-sm transition-colors"
                 onClick={handleBookTicket}
               >
                 Đặt vé
               </Button>
            </div>
          ) : (
            // Hiển thị Ngày Khởi Chiếu (Cho phim sắp chiếu)
            <div className="flex w-full items-center justify-center rounded bg-gray-100 py-1.5 text-xs font-semibold text-gray-600">
               <Calendar className="mr-1.5 h-3 w-3 text-[#F5C518]" />
               Khởi chiếu: {formatDate(movie.releaseDate)}
            </div>
          )}

        </div>
      </div>
    </motion.div>
  )
}