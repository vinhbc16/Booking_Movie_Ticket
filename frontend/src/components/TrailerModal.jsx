import React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function TrailerModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen) return null

  /**
   * Convert any YouTube link to Embed link
   * Supports: 
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID (Short link)
   * - https://www.youtube.com/embed/VIDEO_ID
   */
  const getEmbedUrl = (url) => {
    if (!url) return ''
    
    // Regex to capture video ID from any YouTube link format
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    // If ID found (usually 11 characters)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    }

    return url // Return original link if unable to process
  }

  const overlay = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop - Click outside to close */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Video Container */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <iframe 
          src={getEmbedUrl(videoUrl)} 
          title="Movie Trailer"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}