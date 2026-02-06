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
        // Call 2 APIs in parallel
        const [showingRes, comingRes] = await Promise.all([
          // API 1: Get now showing movies
          movieService.getShowingMovies(), 
          // API 2: Get coming soon movies
          movieService.getComingSoonMovies()
        ])
        
        setShowingMovies(showingRes.data.moviesList || [])
        setComingMovies(comingRes.data.moviesList || [])
      } catch (err) {
        console.error("Error loading movies:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Hero Banner (Full screen) */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 2. NOW SHOWING MOVIES SECTION */}
        <MovieSection 
          title="Now Showing" 
          movies={showingMovies} 
          linkToAll="/movies?status=showing"
          background="bg-blue-50/50" 
        />

        {/* 3. COMING SOON MOVIES SECTION */}
        <MovieSection 
          title="Coming Soon" 
          movies={comingMovies} 
          linkToAll="/movies?status=coming_soon"
          background="bg-white"
        />
      </div>

      {/* 4. Placeholder for News/Promotions */}
      <div className="py-16 text-center bg-white border-t">
        <h2 className="text-2xl font-bold text-gray-300">News & Promotions (Coming Soon)</h2>
      </div>
    </div>
  )
}