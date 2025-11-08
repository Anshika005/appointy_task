"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { BookmarkCard } from "./bookmark-card"
import { AddBookmarkModal } from "./add-bookmark-modal"
import { EditBookmarkModal } from "./edit-bookmark-modal"
import { AISearch } from "./ai-search"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, LogOut, Search, Sparkles } from "lucide-react"

interface Bookmark {
  _id: string
  title: string
  description?: string
  url: string
  imageUrl?: string
  contentType?: string
}

export function Dashboard() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isAISearchOpen, setIsAISearchOpen] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      router.push("/")
    } else {
      fetchBookmarks()
    }
  }, [user, token, router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBookmarks(bookmarks)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query),
      )
      setFilteredBookmarks(filtered)
    }
  }, [searchQuery, bookmarks])

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data)
        setFilteredBookmarks(data)
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBookmark = async (data: {
    url: string
    title: string
    description: string
    imageUrl: string
    contentType: string
  }) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await fetchBookmarks()
      }
    } catch (error) {
      console.error("Failed to add bookmark:", error)
    }
  }

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setIsEditModalOpen(true)
  }

  const handleUpdateBookmark = async (data: {
    title: string
    description: string
    imageUrl: string
    contentType: string
  }) => {
    if (!editingBookmark) return
    try {
      const response = await fetch(`/api/bookmarks/${editingBookmark._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await fetchBookmarks()
        setEditingBookmark(null)
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    if (confirm("Are you sure you want to delete this bookmark?")) {
      try {
        const response = await fetch(`/api/bookmarks/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          await fetchBookmarks()
        }
      } catch (error) {
        console.error("Failed to delete bookmark:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-card/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Synapse</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout()
              router.push("/")
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setIsAISearchOpen(true)} className="gap-2">
            <Sparkles className="w-4 h-4" />
            AI Search
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Bookmark
          </Button>
        </div>

        {/* Bookmarks Grid */}
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {bookmarks.length === 0 ? "No bookmarks yet. Start by adding one!" : "No bookmarks match your search."}
            </p>
            {bookmarks.length === 0 && <Button onClick={() => setIsAddModalOpen(true)}>Add Your First Bookmark</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark._id}
                id={bookmark._id}
                title={bookmark.title}
                description={bookmark.description}
                url={bookmark.url}
                imageUrl={bookmark.imageUrl}
                contentType={bookmark.contentType}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddBookmarkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddBookmark} />
      {editingBookmark && (
        <EditBookmarkModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingBookmark(null)
          }}
          bookmark={editingBookmark}
          onSubmit={handleUpdateBookmark}
        />
      )}
      <AISearch isOpen={isAISearchOpen} onClose={() => setIsAISearchOpen(false)} />
    </div>
  )
}
