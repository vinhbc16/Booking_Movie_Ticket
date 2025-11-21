import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Play, Info, ChevronRight, ChevronLeft, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { movieService } from '@/services/movieService'

export function HeroSection() {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // 1. Fetch dữ liệu
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await movieService.getFeaturedMovies()
        if (res.data && res.data.movies) {
          setMovies(res.data.movies)
        }
      } catch (error) {
        console.error("Lỗi tải banner:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  // 2. Auto slide
  useEffect(() => {
    if (movies.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [movies.length])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % movies.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)

  if (isLoading) return <div className="h-[85vh] w-full bg-black animate-pulse" />
  if (movies.length === 0) return null

  const currentMovie = movies[currentIndex]
  const releaseYear = new Date(currentMovie.releaseDate).getFullYear()
  const genres = Array.isArray(currentMovie.genre) ? currentMovie.genre.join(', ') : currentMovie.genre

  return (
    <div className="relative h-[100vh] w-full overflow-hidden bg-black text-white group">
      
      {/* --- BACKGROUND IMAGE --- */}
      {movies.map((movie, index) => (
        <div
          key={movie._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover object-center" 
          />
          
          {/* Gradient Overlay:
             - from-black/90: Màu đen đậm ở dưới/trái để chữ trắng nổi bật
             - to-transparent: Để lộ ảnh ở trên/phải
          */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </div>
      ))}

      {/* --- CONTENT (Thiết kế lại theo style ảnh mẫu) --- */}
      <div className="absolute bottom-0 left-0 z-20 flex h-full w-full flex-col justify-center px-6 pb-10 md:px-16 md:pb-16 lg:w-2/3 transform translate-y-[20%]">
        <div className="animate-fade-in space-y-5">
          
          {/* 1. TIÊU ĐỀ: In hoa, Font to, Đậm */}
          <h1 className="text-5xl max-w-xl font-extrabold uppercase leading-tight tracking-tight md:text-5xl drop-shadow-xl">
            {currentMovie.title}
          </h1>

          {/* 2. META TAGS (Hàng thông tin dạng hộp) */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold md:text-base transform">
            {/* Rating Box (Vàng - Giống IMDb trong ảnh mẫu) */}
            <div className="rounded border border-[#F5C518] bg-[#F5C518] px-2 py-0.5 text-black text-xs">
              {currentMovie.ageRating}
            </div>

            {/* Năm phát hành (Trắng) */}
            <div className="rounded border border-white/40 bg-transparent px-2 py-0.5 text-white text-xs">
              {releaseYear}
            </div>

            {/* Thời lượng (Trắng) */}
            <div className="rounded border border-white/40 bg-transparent px-2 py-0.5 text-white text-xs">
              {currentMovie.duration} phút
            </div>

            {/* Status (Tùy chọn) */}
            <div className="rounded border border-white/40 bg-transparent px-2 py-0.5 text-white text-xs">
              {currentMovie.status === 'showing' ? 'Showing' : 'Coming Soon'}
            </div>
          </div>

          {/* 3. THỂ LOẠI (Dạng text xám/trắng nhạt) */}
          <div className="text-base font-medium text-gray-300 md:text-lg transform">
            {genres}
          </div>

          {/* 4. MÔ TẢ */}
          <p className="line-clamp-3 max-w-2xl text-sm font-normal text-gray-200 leading-relaxed drop-shadow-md transform">
            {currentMovie.description}
          </p>

          {/* 5. BUTTONS (Giữ tính năng cũ nhưng style lại chút cho hợp nền đen) */}
          <div className="flex flex-wrap gap-4 pt-2 transform">
            <Button 
              size="lg" 
              className="h-12 rounded-full bg-[#F5C518] px-8 text-lg font-bold text-black hover:bg-[#dcb015] transition-transform hover:scale-105"
              onClick={() => navigate(`/booking/${currentMovie._id}`)}
            >
              <Play className="mr-2 h-5 w-5 fill-current" />
              Đặt vé ngay
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 rounded-full border-2 border-white/30 bg-white/10 px-8 text-lg font-bold text-white hover:bg-white/20 backdrop-blur-md transition-transform hover:scale-105"
              onClick={() => navigate(`/movie/${currentMovie._id}`)}
            >
              <Info className="mr-2 h-5 w-5" />
              Chi tiết
            </Button>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION ARROWS --- */}
      <div className="absolute bottom-8 right-8 z-30 hidden gap-3 md:flex">
        <Button variant="outline" size="icon" onClick={prevSlide} className="h-12 w-12 rounded-full border-white/20 bg-black/30 text-white hover:bg-white/20 backdrop-blur-sm">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" onClick={nextSlide} className="h-12 w-12 rounded-full border-white/20 bg-black/30 text-white hover:bg-white/20 backdrop-blur-sm">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}