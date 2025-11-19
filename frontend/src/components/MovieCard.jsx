import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MovieCard({ movie }) {
  const genreText = Array.isArray(movie.genre) ? movie.genre.join(', ') : 'N/A'
  
  return (
    <Card className="group w-full overflow-hidden transition-all duration-300 hover:shadow-custom-lg hover:shadow-primary/20">
      <CardContent className="relative h-96 p-0">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Badge 
          className="absolute right-3 top-3" 
          variant={movie.ageRating === 'C18' ? 'destructive' : 'secondary'}
        >
          {movie.ageRating}
        </Badge>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 p-4">
        <h3 className="truncate text-lg font-bold group-hover:text-primary">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {genreText}
        </p>
      </CardFooter>
    </Card>
  )
}