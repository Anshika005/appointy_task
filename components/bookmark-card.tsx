"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, ExternalLink } from "lucide-react"

interface Bookmark {
  _id: string
  title: string
  description?: string
  url: string
  imageUrl?: string
  contentType?: string
}

interface BookmarkCardProps {
  id: string
  title: string
  description?: string
  url: string
  imageUrl?: string
  contentType?: string
  onEdit: (bookmark: Bookmark) => void 
  onDelete: (id: string) => void
}

const ContentTypeIcon = {
  article: "📰",
  product: "🛍️",
  video: "🎥",
  todo: "✓",
  research: "🔬",
  inspiration: "✨",
  default: "🔖",
}

export function BookmarkCard({
  id,
  title,
  description,
  url,
  imageUrl,
  contentType = "article",
  onEdit,
  onDelete,
}: BookmarkCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  const icon = ContentTypeIcon[contentType as keyof typeof ContentTypeIcon] || ContentTypeIcon.default
    
  const bookmarkData: Bookmark = {
    _id: id,
    title,
    description,
    url,
    imageUrl,
    contentType,
  }

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-card border-border/50 hover:border-border flex flex-col h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Section */}
      {imageUrl ? (
        <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
            {icon}
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <span className="text-6xl opacity-30 relative z-10">{icon}</span>
        </div>
      )}

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* URL Domain */}
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
          <p className="truncate">{new URL(url).hostname}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-border/50">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </Button>
          </a>

          {/* Edit/Delete buttons - always visible on mobile, hover on desktop */}
          <div className={`flex gap-1 transition-all duration-200 ${
            isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 md:opacity-0 sm:opacity-100 translate-x-2 md:translate-x-2 sm:translate-x-0'
          }`}>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(bookmarkData) 
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(id)
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}