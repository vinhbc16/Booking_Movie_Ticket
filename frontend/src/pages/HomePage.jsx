import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { movieService } from '@/services/movieService'
import { MovieCard } from '@/components/MovieCard' // Import card

export default function HomePage() {
  const [showingMovies, setShowingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Gọi API lấy phim đang chiếu
    setIsLoading(true)
    movieService.getShowingMovies()
      .then(response => {
        setShowingMovies(response.data.moviesList)
      })
      .catch(err => {
        console.error(err);
        toast.error("Lỗi khi tải danh sách phim.");
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, []) // Chỉ chạy 1 lần

  return (
    <div className="container py-12">
      {/* === PHẦN PHIM ĐANG CHIẾU === */}
      <section>
        <h2 className="mb-6 text-3xl font-bold">Phim đang chiếu</h2>
        
        {isLoading ? (
          <p>Đang tải phim...</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {showingMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* (Các phần khác như Lịch chiếu, Blog... sẽ được thêm ở đây sau) */}
    </div>
  )
}