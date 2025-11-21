import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { movieService } from '@/services/movieService'
import { MovieCard } from '@/components/MovieCard' 
import { HeroSection } from '@/features/home/components/HeroSection'

export default function HomePage() {
  const [showingMovies, setShowingMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    
    movieService.getShowingMovies()
      .then(response => {
        setShowingMovies(response.data.moviesList)
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* HeroSection tự lo việc fetch data FeaturedMovies bên trong nó rồi */}
      <HeroSection />

      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {/* === PHẦN PHIM ĐANG CHIẾU === */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Phim đang chiếu</h2>
              <p className="mt-2 text-muted-foreground">Đừng bỏ lỡ các bom tấn đang rầm rộ tại rạp</p>
            </div>
            <a href="/movies" className="text-primary hover:underline">Xem tất cả &rarr;</a>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
               {/* Skeleton loading đơn giản */}
               {[1,2,3,4].map(i => <div key={i} className="h-64 w-full animate-pulse bg-gray-200 rounded-lg"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {/* Render danh sách showingMovies */}
              {showingMovies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}