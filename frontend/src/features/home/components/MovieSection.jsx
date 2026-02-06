import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { MovieCard } from '@/components/MovieCard'

export function MovieSection({ title, movies, linkToAll, background = "bg-white" }) {
  const navigate = useNavigate()

  if (!movies || movies.length === 0) return null

  return (
    <section className={`py-12 ${background} rounded-2xl`}>
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h2>
          <div className="mt-2 h-1 w-24 bg-yellow-600 mx-auto rounded-full"></div>
        </div>

        {/* Carousel */}
        <div className="px-8"> {/* Padding để chừa chỗ cho nút prev/next */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {movies.map((movie,idx) => (
                <CarouselItem key={movie._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <div className="h-full p-1">
                    <MovieCard movie={movie} index={idx}/>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons */}
            <CarouselPrevious className="bg-white border-gray-200 hover:bg-blue-50 hover:text-yellow-600 h-10 w-10 -left-4 lg:-left-12 shadow-md" />
            <CarouselNext className="bg-white border-gray-200 hover:bg-blue-50 hover:text-yellow-600 h-10 w-10 -right-4 lg:-right-12 shadow-md" />
          </Carousel>
        </div>

        {/* View More Button */}
        <div className="mt-10 flex justify-center">
          <Button 
            variant="outline" 
            size="lg"
            className="group rounded-full border-grey-300 px-8 text-gray-600 hover:border-blue-600 hover:text-blue-600"
            onClick={() => navigate(linkToAll)}
          >
            View More
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}