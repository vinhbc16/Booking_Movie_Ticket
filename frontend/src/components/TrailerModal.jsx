import React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function TrailerModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen) return null

  /**
   * Hàm chuyển đổi mọi loại link YouTube sang link Embed
   * Hỗ trợ: 
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID (Link rút gọn)
   * - https://www.youtube.com/embed/VIDEO_ID
   */
  const getEmbedUrl = (url) => {
    if (!url) return ''
    
    // Regex để bắt ID video từ mọi dạng link YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    // Nếu tìm thấy ID (thường là 11 ký tự)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    }

    return url // Trả về link gốc nếu không xử lý được (dù có thể vẫn lỗi)
  }

  const overlay = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop mờ - Click ra ngoài để đóng */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Video Container */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Nút đóng */}
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