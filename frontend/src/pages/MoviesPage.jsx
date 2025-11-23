import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import { Home, ChevronRight } from 'lucide-react'
import { movieService } from '@/services/movieService'
import { MovieCard } from '@/components/MovieCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Danh sách thể loại (Bạn có thể lấy từ DB hoặc hardcode nếu ít thay đổi)
const GENRES = [
  "Hành động", "Hài", "Kinh dị", "Lãng mạn", "Viễn tưởng", 
  "Hoạt hình", "Tâm lý", "Gia đình", "Chiến tranh", "Phiêu lưu"
]

export default function MoviesPage() {
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status') || 'showing' // Mặc định là đang chiếu
  
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [genre, setGenre] = useState('all') // State cho bộ lọc

  // Tiêu đề trang dựa theo status
  const pageTitle = statusParam === 'showing' ? 'Phim Đang Chiếu' : 'Phim Sắp Chiếu'

  // Fetch dữ liệu
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const res = await movieService.getPublicMovies({
          status: statusParam,
          genre: genre === 'all' ? undefined : genre,
          limit: 20 // Lấy nhiều hơn cho trang danh sách
        })
        setMovies(res.data.moviesList || [])
      } catch (error) {
        console.error("Lỗi tải phim:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [statusParam, genre]) // Chạy lại khi status hoặc genre thay đổi

  return (
    <div className="min-h-screen bg-background-secondary pb-12">
      
      {/* --- 1. HERO BANNER --- */}
      <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700">
        {/* Họa tiết nền (Optional) */}
        {/* <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)' }}></div> */}
        
        <div className="container relative flex h-full flex-col justify-center px-4 text-white">
          {/* Breadcrumb */}
          <nav className="mb-2 flex items-center gap-2 text-sm text-blue-100">
            <Link to="/" className="flex items-center hover:text-white transition-colors">
              <Home className="mr-1 h-4 w-4" /> Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-white">{pageTitle}</span>
          </nav>
          
          <h1 className="text-4xl font-bold uppercase tracking-wide">{pageTitle}</h1>
        </div>
      </div>

      {/* --- 2. FILTER & CONTENT --- */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Thanh công cụ: Tiêu đề nhỏ & Bộ lọc */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center border-b pb-4">
          <div className="flex items-center gap-2">
             <div className="h-8 w-2 rounded-full bg-primary"></div>
             <h2 className="text-2xl font-bold text-gray-800 uppercase">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Lọc theo:</span>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Tất cả thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thể loại</SelectItem>
                {GENRES.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lưới phim */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
             {[1,2,3,4,5,6,7,8].map(i => (
               <div key={i} className="h-[400px] w-full animate-pulse rounded-xl bg-gray-200"></div>
             ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-500">Không tìm thấy phim nào phù hợp.</p>
            {/* <button 
              onClick={() => setGenre('all')}
              className="mt-4 text-primary hover:underline"
            >
              Xóa bộ lọc
            </button> */}
          </div>
        )}
      </div>
    </div>
  )
}