import React, { useState, useEffect } from 'react'
import { movieService } from '@/services/movieService'
import { HeroSection } from '@/features/home/components/HeroSection'
import { MovieSection } from '@/features/home/components/MovieSection'

export default function HomePage() {
  const [showingMovies, setShowingMovies] = useState([])
  const [comingMovies, setComingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Gọi song song 2 API riêng biệt
        const [showingRes, comingRes] = await Promise.all([
          // API 1: Lấy phim đang chiếu
          movieService.getShowingMovies(), 
          // API 2: Lấy phim sắp chiếu
          movieService.getComingSoonMovies()
        ])
        
        setShowingMovies(showingRes.data.moviesList || [])
        setComingMovies(comingRes.data.moviesList || [])
      } catch (err) {
        console.error("Lỗi tải phim:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Hero Banner (Full màn hình) */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 2. SECTION PHIM ĐANG CHIẾU */}
        {/* background="bg-white": Nền trắng nổi bật */}
        <MovieSection 
          title="Phim Đang Chiếu" 
          movies={showingMovies} 
          linkToAll="/movies?status=showing"
          background="bg-blue-50/50" 
        />

        {/* 3. SECTION PHIM SẮP CHIẾU */}
        {/* Nhân bản giao diện, chỉ thay đổi dữ liệu và màu nền nhẹ để phân cách */}
        <MovieSection 
          title="Phim Sắp Chiếu" 
          movies={comingMovies} 
          linkToAll="/movies?status=coming_soon"
          background="bg-white"
        />
      </div>

      {/* 4. Placeholder cho Blog/Khuyến mãi */}
      <div className="py-16 text-center bg-white border-t">
        <h2 className="text-2xl font-bold text-gray-300">Tin tức & Khuyến mãi (Coming Soon)</h2>
      </div>
    </div>
  )
}