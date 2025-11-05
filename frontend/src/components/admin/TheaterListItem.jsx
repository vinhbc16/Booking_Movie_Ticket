import React from 'react'
import { Pencil, Trash2, Building } from 'lucide-react' // Thêm icon Building
import { Button } from '@/components/ui/button'

// Component cho 1 item rạp
export function TheaterListItem({ theater, onEdit, onDelete }) {
  return (
    <div className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Building className="h-6 w-6" />
      </div>
      
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold">{theater.name}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {theater.address}
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(theater)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}