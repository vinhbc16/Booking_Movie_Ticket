import React, { useState, useEffect , useRef } from 'react'
import { useParams, Link, useNavigate , useLocation} from 'react-router'
import { Play, Calendar, Clock, Home, ChevronRight } from 'lucide-react'
import { movieService } from '@/services/movieService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrailerModal } from '@/components/TrailerModal' // Import Modal
import { BookingSection } from './BookingSection'

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation() // Get location to read state
  
  const bookingSectionRef = useRef(null)
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true)
      try {
        const res = await movieService.getMovieDetail(id)
        setMovie(res.data.movie)
      } catch (error) {
        console.error("Error loading movie:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  // Handle Auto Scroll to booking section
  useEffect(() => {
    // If movie loaded and scroll requested
    if (!isLoading && movie && location.state?.scrollToBooking && bookingSectionRef.current) {
      
      // Smooth scroll
      bookingSectionRef.current.scrollIntoView({ behavior: 'smooth' })
      
      // (Optional) Clear state to prevent re-scroll on refresh
      window.history.replaceState({}, document.title)
    }
  }, [isLoading, movie, location.state]) // Run when data is ready
  
  if (isLoading) return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading movie information...</div>
    </div>
  )

  if (!movie) return <div className="text-center py-20">Movie not found</div>


  // Determine Breadcrumb based on status
  const isShowing = movie.status === 'showing'
  const categoryLink = isShowing ? '/movies?status=showing' : '/movies?status=coming_soon'
  const categoryName = isShowing ? 'Now Showing' : 'Coming Soon'

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      {/* --- 1. BREADCRUMB --- */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="flex items-center hover:text-primary transition-colors">
              <Home className="mr-1 h-4 w-4" /> Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={categoryLink} className="hover:text-primary transition-colors">
              {categoryName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-gray-900 truncate max-w-[200px] md:max-w-none">
              {movie.title}
            </span>
          </nav>
        </div>
      </div>

      {/* --- 2. MOVIE INFO SECTION --- */}
      <div className="container mx-auto px-16 py-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Poster */}
          <div className="w-full md:w-[300px] lg:w-[350px] flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-gray-200 group">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Play Button on Poster (Optional) */}
              <div 
                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setShowTrailer(true)}
              >
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white" />
                 </div>
              </div>

              {/* Age Rating Badge */}
              <Badge className={`absolute top-3 left-3 text-sm px-3 py-1 ${
                 movie.ageRating === 'C18' ? 'bg-red-600' : 'bg-orange-500'
              }`}>
                {movie.ageRating}
              </Badge>
            </div>
          </div>

          {/* Right Column: Movie Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
              {movie.title}
            </h1>
            
            <div className="text-lg text-gray-500 mb-6 font-medium">
              {movie.title} (Original Title)
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-8 text-justify border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-2 rounded-r-lg">
              {movie.description}
            </p>

            {/* Information Table (Grid Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base mb-8">
              <div className="flex">
                <span className="w-32 font-bold text-gray-900">Director:</span>
                <span className="text-gray-600">{movie.director}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-gray-900">Cast:</span>
                <span className="text-gray-600 flex-1">
                   {Array.isArray(movie.actors) ? movie.actors.join(', ') : movie.actors}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-gray-900">Genre:</span>
                <span className="text-gray-600">
                   {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                </span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-gray-900">Release:</span>
                <span className="text-gray-600">{formatDate(movie.releaseDate)}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-gray-900">Duration:</span>
                <span className="text-gray-600">{movie.duration} minutes</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-gray-900">Language:</span>
                <span className="text-gray-600">{movie.language}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
                {isShowing && (
                    <Button 
                        size="lg" 
                        className="h-12 px-8 text-base font-bold bg-[#F5C518] text-black hover:bg-[#dcb015] shadow-lg shadow-yellow-500/20"
                        // onClick={() => {
                        //     // Scroll xuống phần đặt vé (Sẽ làm sau)
                        //     document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
                        // }}
                        onClick={() => bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        BUY TICKETS
                    </Button>
                )}
                
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12 px-6 border-gray-300 hover:bg-gray-100 hover:text-blue-600 gap-2"
                    onClick={() => setShowTrailer(true)}
                >
                    <Play className="w-5 h-5" /> WATCH TRAILER
                </Button>
            </div>

          </div>
        </div>
      </div>

      {/* --- 3. BOOKING SECTION --- */}
      <div ref={bookingSectionRef} id="booking-section" className="container mx-auto px-14 mt-12 pt-12 border-t">
         <h2 className="text-2xl font-bold mb-6 uppercase border-l-4 border-[#F5C518] pl-3">
            Showtimes
         </h2>
         {/* <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
            Phần chọn lịch chiếu sẽ hiển thị ở đây...
         </div> */}
         {movie && <BookingSection movieId={movie._id} />}
      </div>

      {/* --- TRAILER MODAL --- */}
      <TrailerModal 
        isOpen={showTrailer} 
        onClose={() => setShowTrailer(false)} 
        videoUrl={movie.trailerUrl} 
      />
    </div>
  )
}