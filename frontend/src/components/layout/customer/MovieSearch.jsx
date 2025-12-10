import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom' 
import { Search, Loader2, X, Film, User } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from '@/hooks/useDebounce'
import { movieService } from '@/services/movieService'
import { cn } from '@/lib/utils'

export function MovieSearch({ className }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const inputRef = useRef(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 700)
  const navigate = useNavigate()

  // 1. Xử lý tìm kiếm
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([])
      return
    }

    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const res = await movieService.searchMovies(debouncedSearchTerm)
        setResults(res.data.moviesList || [])
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [debouncedSearchTerm])

  // 2. Auto focus vào ô input khi mở
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isOpen])

  // 3. Đóng khi nhấn ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // 4. Khóa cuộn trang khi mở tìm kiếm (Optional - để trải nghiệm tốt hơn)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleSelectMovie = (movieId) => {
    setIsOpen(false)
    navigate(`/movie/${movieId}`)
  }

  // Tách phần giao diện Overlay ra biến cho gọn
  const SearchOverlay = (
    <div className="fixed inset-0 z-[9999] flex justify-center pt-[100px]">
      {/* LỚP MỜ (Backdrop):
          - z-[9999]: Đảm bảo nó nằm trên tất cả mọi thứ
          - bg-black/80: Đen đậm
          - backdrop-blur-sm: Làm mờ nội dung bên dưới
      */}
      <div 
        className="fixed inset-0 backdrop-blur-sm transition-opacity animate-in fade-in duration-200 bg-black/80"
        onClick={() => setIsOpen(false)} 
      />

      {/* HỘP TÌM KIẾM */}
      <div className="relative z-50 w-full max-w-2xl px-4 animate-in fade-in zoom-in-95 slide-in-from-top-5 duration-200">
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-white/10">
          
          {/* Header của Box */}
          <div className="flex items-center border-b px-4 py-4">
            <Search className="mr-3 h-6 w-6 text-gray-400" />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-xl outline-none placeholder:text-gray-400 text-black font-medium"
              placeholder="Tìm tên phim, diễn viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <button onClick={() => setSearchTerm("")} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">ESC</span>
                </kbd>
                <button onClick={() => setIsOpen(false)} className="sm:hidden text-sm text-gray-500 font-medium">
                  Hủy
                </button>
              </div>
            )}
          </div>

          {/* Phần kết quả */}
          <div className="max-h-[60vh] overflow-y-auto p-2 bg-gray-50/50">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-1">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kết quả phù hợp nhất
                </p>
                {results.map((movie) => (
                  <div
                    key={movie._id}
                    className="flex cursor-pointer items-start gap-4 rounded-lg p-3 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group"
                    onClick={() => handleSelectMovie(movie._id)}
                  >
                    {/* Poster */}
                    <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md shadow-sm group-hover:shadow-md transition-shadow">
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    {/* Thông tin */}
                    <div className="flex flex-1 flex-col justify-center gap-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-primary transition-colors">
                          {movie.title}
                        </h4>
                        {movie.status === 'showing' && (
                            <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 text-[10px] whitespace-nowrap font-bold">
                              ĐANG CHIẾU
                            </Badge>
                        )}
                        {movie.status === 'coming_soon' && (
                            <Badge variant="secondary" className="bg-yellow-50 text-yellow-600 border-red-100 text-[10px] whitespace-nowrap font-bold">
                              SẮP CHIẾU
                            </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                           <Film className="h-3 w-3" /> {movie.duration}'
                        </span>
                        <span className="text-xs font-medium border px-1.5 rounded">
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1 line-clamp-1">
                         <User className="h-3 w-3" /> 
                         <span className="text-xs">
                           {Array.isArray(movie.actors) ? movie.actors.join(', ') : movie.actors}
                         </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="py-16 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                   <Search className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900">Không tìm thấy kết quả nào</p>
                <p className="text-sm text-gray-500 mt-1">Hãy thử tìm với tên phim hoặc diễn viên khác</p>
              </div>
            ) : (
              <div className="py-16 text-center">
                <Search className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Nhập từ khóa để bắt đầu tìm kiếm...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Nút tìm kiếm trên Header */}
      <Button 
        variant="ghost" 
        size="icon" 
        // className="text-white hover:bg-white/20 transition-colors"
        className={cn("transition-colors", className)}
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* 2. Dùng createPortal để đẩy Overlay ra ngoài body
          Điều này giúp nó thoát khỏi Header và phủ kín toàn màn hình
      */}
      {isOpen && createPortal(SearchOverlay, document.body)}
    </>
  )
}