import React from 'react'
import { useNavigate } from 'react-router'
import { Clock, Play, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

// Helper to format release date
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

  // Handle Book Ticket button click
  const handleBookTicket = (e) => {
    e.stopPropagation() // Prevent card click
    // Navigate to detail page with scrollToBooking state
    navigate(`/movie/${movie._id}`, { state: { scrollToBooking: true } })
  }

  return (
    <motion.div 
      // Initial state: faded and positioned 50px below
      initial={{ opacity: 0, y: 60 }}
      
      // When scrolled into view: visible and at original position
      whileInView={{ opacity: 1, y: 0.5 }}
      
      // Viewport config: once: true (only run once, scrolling up won't hide again)
      viewport={{ once: true, margin: "-50px" }}
      
      // Duration: delay based on index for staggered effect
      transition={{ duration: 0.5, delay: index ? index * 0.1 : 0 }}
    className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100">
      
      {/* 1. POSTER */}
      <div className="relative aspect-[2/3] overflow-hidden cursor-pointer" onClick={() => navigate(`/movie/${movie._id}`)}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Age Rating Badge */}
        <Badge className={`absolute left-2 top-2 border-none px-2 py-1 text-xs font-bold shadow-sm ${
            movie.ageRating === 'C18' ? 'bg-red-600' : 'bg-[#F5C518] text-black'
        }`}>
          {movie.ageRating}
        </Badge>
      </div>

      {/* 2. CONTENT */}
      <div className="flex flex-1 flex-col p-3">
        {/* Movie Title */}
        <h3 
          className="mb-1 line-clamp-2 text-base font-bold uppercase text-gray-800 transition-colors cursor-pointer min-h-[3rem]"
          onClick={() => navigate(`/movie/${movie._id}`)}
          title={movie.title}
        >
          {movie.title}
        </h3>

        {/* Genre */}
        <p className="mb-3 line-clamp-1 text-xs text-gray-500">
          {displayGenres}
        </p>

        {/* Card Footer */}
        <div className="mt-auto pt-2 border-t border-gray-50">
          
          {isShowing ? (
            <div className="flex items-center justify-between gap-2">
               {/* Duration (Only show when currently showing to save space) */}
               <div className="flex items-center text-xs font-medium text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {movie.duration}'
               </div>

               {/* Book Ticket Button */}
               <Button 
                 size="sm" 
                 className="h-8 px-4 text-xs font-bold text-[#f5f5f6] bg-[#4176e8] hover:bg-[#0654fc] shadow-sm transition-colors"
                 onClick={handleBookTicket}
               >
                 Book Now
               </Button>
            </div>
          ) : (
            // Show Release Date (For upcoming movies)
            <div className="flex w-full items-center justify-center rounded bg-gray-100 py-1.5 text-xs font-semibold text-gray-600">
               <Calendar className="mr-1.5 h-3 w-3 text-[#F5C518]" />
               Release: {formatDate(movie.releaseDate)}
            </div>
          )}

        </div>
      </div>
    </motion.div>
  )
}