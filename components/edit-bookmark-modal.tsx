"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface Bookmark {
  _id: string
  title: string
  description?: string
  url: string
  imageUrl?: string
  contentType?: string
}

interface EditBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  bookmark: Bookmark
  onSubmit: (data: {
    title: string
    description: string
    imageUrl: string
    contentType: string
  }) => Promise<void>
  isLoading?: boolean
}

export function EditBookmarkModal({ isOpen, onClose, bookmark, onSubmit, isLoading }: EditBookmarkModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    contentType: "article",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title,
        description: bookmark.description || "",
        imageUrl: bookmark.imageUrl || "",
        contentType: bookmark.contentType || "article",
      })
    }
  }, [bookmark])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title) {
      setError("Title is required")
      return
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update bookmark")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Bookmark</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">URL (Read-only)</label>
            <Input type="url" value={bookmark.url} disabled className="opacity-60" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              type="text"
              placeholder="Bookmark title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Update description..."
              className="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground"
            >
              <option value="article">Article</option>
              <option value="product">Product</option>
              <option value="video">Video</option>
              <option value="todo">To-Do</option>
              <option value="research">Research</option>
              <option value="inspiration">Inspiration</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Updating..." : "Update Bookmark"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
