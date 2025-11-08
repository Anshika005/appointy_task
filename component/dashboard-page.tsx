"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LogOut, Plus } from "lucide-react"
import KnowledgeCard from "@/components/knowledge-card"
import UploadModal from "@/components/upload-modal"

interface KnowledgeItem {
  id: string
  title: string
  category: string
  description: string
  image?: string
  tags: string[]
  date: string
  color: string
  size: string
}

interface DashboardPageProps {
  onLogout: () => void
  userItems: KnowledgeItem[]
  onAddItem: (item: Omit<KnowledgeItem, "id" | "date">) => void
  onDeleteItem: (id: string) => void
}

export default function DashboardPage({ onLogout, userItems, onAddItem, onDeleteItem }: DashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const defaultItems: KnowledgeItem[] = [
    {
      id: "default-1",
      title: "Project Documentation",
      category: "Documents",
      description: "Important PDF files and technical documentation",
      tags: ["Documents", "PDF", "Reference"],
      date: "2024-01-15",
      color: "from-blue-500/20 to-blue-600/20",
      size: "small",
    },
    {
      id: "default-2",
      title: "Monthly Expense Report",
      category: "Finance",
      description: "Spreadsheet with budget tracking and receipts",
      tags: ["Finance", "Expense", "Tracking"],
      date: "2024-01-18",
      color: "from-green-500/20 to-emerald-600/20",
      size: "small",
    },
    {
      id: "default-3",
      title: "Travel Photos 2024",
      category: "Media",
      description: "Personal collection of vacation and travel photography",
      tags: ["Photos", "Travel", "Media"],
      date: "2024-01-17",
      color: "from-purple-500/20 to-pink-600/20",
      size: "medium",
    },
    {
      id: "default-4",
      title: "Insurance Documents",
      category: "Documents",
      description: "Health, auto, and home insurance policies and records",
      tags: ["Insurance", "Documents", "Important"],
      date: "2024-01-16",
      color: "from-orange-500/20 to-red-600/20",
      size: "small",
    },
    {
      id: "default-5",
      title: "Digital Portfolio",
      category: "Work",
      description: "Collection of project screenshots and portfolio pieces",
      tags: ["Portfolio", "Work", "Projects"],
      date: "2024-01-14",
      color: "from-cyan-500/20 to-blue-600/20",
      size: "large",
    },
    {
      id: "default-6",
      title: "Personal Notes & Ideas",
      category: "Personal",
      description: "Daily journal entries, personal thoughts, and life goals",
      tags: ["Notes", "Personal", "Reflections"],
      date: "2024-01-13",
      color: "from-indigo-500/20 to-purple-600/20",
      size: "small",
    },
    {
      id: "default-7",
      title: "Family Photos Archive",
      category: "Media",
      description: "Precious memories and family event photographs",
      tags: ["Photos", "Family", "Memories"],
      date: "2024-01-12",
      color: "from-red-500/20 to-pink-600/20",
      size: "large",
    },
    {
      id: "default-8",
      title: "Medical Records",
      category: "Health",
      description: "Personal health documents, prescriptions, and medical reports",
      tags: ["Health", "Medical", "Records"],
      date: "2024-01-11",
      color: "from-rose-500/20 to-orange-600/20",
      size: "small",
    },
  ]

  const allItems = [...userItems, ...defaultItems]

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems

    const query = searchQuery.toLowerCase()
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [searchQuery])

  const getGridColSpan = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2"
      case "medium":
        return "md:col-span-2"
      default:
        return "col-span-1"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">PersonalVault</h1>
              <p className="text-slate-400 text-sm mt-1">Your secure personal file storage and organization</p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search your files... photos, documents, receipts, medical records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
              />
            </div>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Results count */}
          {searchQuery && (
            <p className="text-slate-400 text-sm mt-3">
              Found {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-300 text-lg font-semibold mb-2">No files found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search query or upload new files to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-slate-300 text-sm font-medium">
              Showing {filteredItems.length} file{filteredItems.length !== 1 ? "s" : ""}{" "}
              {userItems.length > 0 && `(${userItems.length} personal uploads)`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 auto-rows-max gap-5">
              {filteredItems.map((item) => (
                <div key={item.id} className={getGridColSpan(item.size)}>
                  <KnowledgeCard
                    item={item}
                    onDelete={() => onDeleteItem(item.id)}
                    isUserItem={userItems.some((u) => u.id === item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={onAddItem} />
    </div>
  )
}
