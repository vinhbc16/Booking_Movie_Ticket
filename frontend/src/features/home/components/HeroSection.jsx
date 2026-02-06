import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Play, Info, ChevronRight, ChevronLeft, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { movieService } from '@/services/movieService'
import { motion, AnimatePresence } from 'framer-motion'

export function HeroSection() {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // 1. Fetch data
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await movieService.getFeaturedMovies()
        if (res.data && res.data.movies) {
          setMovies(res.data.movies)
        }
      } catch (error) {
        console.error("Error loading banner:", error)
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
        <AnimatePresence mode='wait'>

        <motion.div
          key={currentIndex} // Key changes trigger animation restart
          initial={{ opacity: 0, scale: 1.1 }} // Start: Fade and slightly zoomed
          animate={{ opacity: 1, scale: 1 }}    // End: Clear and normal size
          exit={{ opacity: 0 }}                 // On exit: Fade out
          transition={{ duration: 0.7 }}        // Duration
          className="absolute inset-0"
        >
          <img
            src={currentMovie.backdropUrl || currentMovie.posterUrl}
            alt={currentMovie.title}
            className="h-full w-full object-cover object-center" 
          />
          
          {/* Gradient Overlay:
             - from-black/90: Dark black at bottom/left for white text to stand out
             - to-transparent: Reveal image on top/right
          */}}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </motion.div>
        </AnimatePresence>

      {/* --- CONTENT (Redesigned following sample image style) --- */}
      <div className="absolute bottom-0 left-0 z-20 flex h-full w-full flex-col justify-center px-6 pb-10 md:px-16 md:pb-16 lg:w-2/3 transform translate-y-[25%]">
        <motion.div 
        // Key changes to replay text animation when slide changes
          key={currentMovie?._id} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          
          // Duration: 1 second, slight delay 0.2s to wait for background image first
          transition={{ duration: 1, delay: 0.6 }}
        className="animate-fade-in space-y-5"
        >
          
          {/* 1. TITLE: Uppercase, Large Font, Bold */}}
          <motion.h1
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="text-5xl max-w-xl font-extrabold uppercase leading-tight tracking-tight md:text-4xl drop-shadow-xl">
            {currentMovie.title}
          </motion.h1>

          {/* 2. META TAGS (Info row in box style) */}
          <motion.div 
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="flex flex-wrap items-center gap-3 text-sm font-bold md:text-base transform">
            {/* Rating Box (Yellow - Like IMDb in sample image) */}
            <div className="rounded border border-[#F5C518] bg-[#F5C518] px-2 py-0.5 text-black text-xs">
              {currentMovie.ageRating}
            </div>

            {/* Release Year (White) */}
            <div className="rounded border border-white/40 bg-transparent px-2 py-0.5 text-white text-xs">
              {releaseYear}
            </div>

            {/* Duration (White) */}
            <div className="rounded border border-white/40 bg-transparent px-2 py-0.5 text-white text-xs">
              {currentMovie.duration} min
            </div>

            {/* Status (Optional) */}
            <div className="rounded border border-white/40 bg-transparent px-2 py-0.5 text-white text-xs">
              {currentMovie.status === 'showing' ? 'Showing' : 'Coming Soon'}
            </div>
          </motion.div>

          {/* 3. GENRE (Gray/light white text) */}
          <motion.div 
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="text-base font-medium text-gray-300 md:text-lg transform">
            {genres}
          </motion.div>

          {/* 4. DESCRIPTION */}}
          <motion.p 
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="line-clamp-3 max-w-2xl text-sm font-normal text-gray-200 leading-relaxed drop-shadow-md transform">
            {currentMovie.description}
          </motion.p>

          {/* 5. BUTTONS (Keep old features but restyle slightly for dark background) */}
          <motion.div 
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="flex flex-wrap gap-4 pt-2 transform">
            <Button 
              size="md" 
              className="h-12 rounded-full bg-[#F5C518] px-8 text-lg font-bold text-black hover:bg-[#dcb015] transition-transform hover:scale-105"
              onClick={() => navigate(`/movie/${currentMovie._id}`, { state: { scrollToBooking: true } })}            >
              <Play className="mr-2 h-5 w-5 fill-current" />
              Book Now
            </Button>
            
            <Button 
              variant="outline" 
              size="md" 
              className="h-12 rounded-full border-2 border-white/30 bg-white/10 px-8 text-lg font-bold text-white hover:bg-white/20 backdrop-blur-md transition-transform hover:scale-105"
              onClick={() => navigate(`/movie/${currentMovie._id}`)}
            >
              <Info className="mr-2 h-5 w-5" />
              Details
            </Button>
          </motion.div>
        </motion.div>
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