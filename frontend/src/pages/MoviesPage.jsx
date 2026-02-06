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

// Genre list (You can fetch from DB or hardcode if rarely changes)
const GENRES = [
  "Action", "Comedy", "Horror", "Romance", "Sci-Fi", 
  "Animation", "Drama", "Family", "War", "Adventure"
]

export default function MoviesPage() {
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status') || 'showing' // Default is now showing
  
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [genre, setGenre] = useState('all') // State for filter

  // Page title based on status
  const pageTitle = statusParam === 'showing' ? 'Now Showing' : 'Coming Soon'

  // Fetch data
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const res = await movieService.getPublicMovies({
          status: statusParam,
          genre: genre === 'all' ? undefined : genre,
          limit: 20 // Get more for list page
        })
        setMovies(res.data.moviesList || [])
      } catch (error) {
        console.error("Error loading movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [statusParam, genre]) // Re-run when status or genre changes

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
              <Home className="mr-1 h-4 w-4" /> Home
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
            <span className="text-sm font-medium text-gray-600">Filter by:</span>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
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
            <p className="text-xl text-gray-500">No matching movies found.</p>
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