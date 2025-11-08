"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Heart, Trash2, Type, ListTodo } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface KnowledgeItem {
  id: string
  title: string
  category: string
  description: string
  image?: string
  content?: string
  tags: string[]
  date: string
  color: string
  size?: string
  uploadType?: string
}

interface KnowledgeCardProps {
  item: KnowledgeItem
  onDelete?: () => void
  isUserItem?: boolean
}

export default function KnowledgeCard({ item, onDelete, isUserItem }: KnowledgeCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
  }

  const renderListContent = (content: string) => {
    const items = content.split("\n").filter((item) => item.trim().length > 0)
    return (
      <ul className="space-y-2">
        {items.slice(0, 4).map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-cyan-400 font-bold mt-0.5">•</span>
            <span className="line-clamp-1">{item.trim()}</span>
          </li>
        ))}
        {items.length > 4 && <li className="text-xs text-slate-500 pl-6">+{items.length - 4} more items</li>}
      </ul>
    )
  }

  return (
    <Card
      className={`bg-gradient-to-br ${item.color} border-slate-700/50 hover:border-slate-500/70 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50 h-full flex flex-col group backdrop-blur-sm relative`}
    >
      {/* User Item Badge */}
      {isUserItem && (
        <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          Your Upload
        </div>
      )}

      {/* Card Image/Header - Enhanced with overlay effects */}
      {item.image && (
        <div className="relative h-40 overflow-hidden bg-slate-800">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/70 z-10"></div>
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {!item.image && (item.uploadType === "text" || item.uploadType === "list") && (
        <div className="h-20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 flex items-center justify-center">
          {item.uploadType === "text" && <Type className="w-8 h-8 text-cyan-400/60" />}
          {item.uploadType === "list" && <ListTodo className="w-8 h-8 text-cyan-400/60" />}
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header - Enhanced spacing and styling */}
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className="bg-slate-800/70 text-slate-200 border-slate-600/50 font-medium text-xs">
            {item.category}
          </Badge>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="text-slate-400 hover:text-red-400 transition-colors duration-200 hover:scale-110"
            >
              <Heart className={`w-4 h-4 transition-all ${isFavorited ? "fill-red-400 text-red-400 scale-110" : ""}`} />
            </button>
            {isUserItem && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-slate-400 hover:text-white transition-colors duration-200 hover:scale-110"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-6 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-30">
                    <button
                      onClick={() => {
                        onDelete?.()
                        setShowMenu(false)
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title - Enhanced typography */}
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 hover:text-cyan-300 transition-colors duration-200 leading-snug">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">{item.description}</p>

        {(item.uploadType === "text" || item.uploadType === "list") && item.content && (
          <div className="mb-4 pb-4 border-b border-slate-700/50">
            {item.uploadType === "text" && (
              <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">{item.content}</p>
            )}
            {item.uploadType === "list" && renderListContent(item.content)}
          </div>
        )}

        {/* Tags - Enhanced styling with better hover states */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-slate-800/60 text-slate-200 border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/80 cursor-pointer transition-all duration-200"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-slate-800/60 text-slate-400">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer - Enhanced with better contrast */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <span className="text-xs font-medium text-slate-400">{formatDate(item.date)}</span>
        </div>
      </div>
    </Card>
  )
}
