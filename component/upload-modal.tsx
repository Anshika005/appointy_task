"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Upload, FileText, File, ImageIcon, Type, ListTodo } from "lucide-react"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (item: {
    title: string
    category: string
    description: string
    tags: string[]
    image?: string
    content?: string
    color: string
    size: string
    uploadType: string
  }) => void
}

const CATEGORIES = ["Documents", "Media", "Finance", "Work", "Health", "Personal", "Travel", "Other"]
const COLORS = [
  "from-blue-500/20 to-blue-600/20",
  "from-green-500/20 to-emerald-600/20",
  "from-purple-500/20 to-pink-600/20",
  "from-orange-500/20 to-red-600/20",
  "from-cyan-500/20 to-blue-600/20",
  "from-indigo-500/20 to-purple-600/20",
  "from-red-500/20 to-pink-600/20",
  "from-rose-500/20 to-orange-600/20",
]

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [uploadType, setUploadType] = useState<"pdf" | "file" | "image" | "text" | "list">("text")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Documents")
  const [tags, setTags] = useState("")
  const [fileName, setFileName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [textContent, setTextContent] = useState("")
  const [listContent, setListContent] = useState("")
  const [size, setSize] = useState("small")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    if ((uploadType === "text" && !textContent.trim()) || (uploadType === "list" && !listContent.trim())) {
      return
    }

    setLoading(true)
    setTimeout(() => {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      onUpload({
        title,
        category,
        description,
        tags: tagArray.length > 0 ? tagArray : [category],
        image: imageUrl || undefined,
        content: uploadType === "text" ? textContent : uploadType === "list" ? listContent : undefined,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size,
        uploadType,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setTags("")
      setFileName("")
      setImageUrl("")
      setTextContent("")
      setListContent("")
      setUploadType("text")
      setSize("small")
      setLoading(false)
      onClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-slate-900/95 border-slate-700/50 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Add Files to PersonalVault</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Upload Type Selector - Added Text and List options */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {[
              { type: "text" as const, icon: Type, label: "Text" },
              { type: "list" as const, icon: ListTodo, label: "List" },
              { type: "pdf" as const, icon: FileText, label: "PDF" },
              { type: "file" as const, icon: File, label: "Document" },
              { type: "image" as const, icon: ImageIcon, label: "Image" },
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setUploadType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  uploadType === type
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">File Name / Title</label>
              <Input
                type="text"
                placeholder="e.g., Travel Notes, Shopping List, Tax Return 2024"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
              <textarea
                placeholder="Describe what this file contains or its purpose"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none"
                rows={3}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:border-cyan-500/50 focus:ring-cyan-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Tags (comma-separated)</label>
              <Input
                type="text"
                placeholder="e.g. Important, Archive, Review"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {uploadType === "text" && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Text Content</label>
                <textarea
                  placeholder="Paste your text content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none"
                  rows={6}
                  required
                />
              </div>
            )}

            {uploadType === "list" && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">List Items (one per line)</label>
                <textarea
                  placeholder="Enter each item on a new line&#10;e.g.&#10;Buy milk&#10;Call dentist&#10;Review document"
                  value={listContent}
                  onChange={(e) => setListContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none font-mono text-sm"
                  rows={6}
                  required
                />
              </div>
            )}

            {/* Conditional Fields Based on Upload Type */}
            {uploadType === "pdf" && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">PDF File Reference</label>
                <Input
                  type="text"
                  placeholder="e.g., document.pdf or PDF file path"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {uploadType === "file" && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">File Reference</label>
                <Input
                  type="text"
                  placeholder="e.g., spreadsheet.xlsx or document.docx"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {uploadType === "image" && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Image URL or Path</label>
                <Input
                  type="url"
                  placeholder="https://example.com/photo.jpg or image file path"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            )}

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Card Size</label>
              <div className="flex gap-3">
                {["small", "medium", "large"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      size === s ? "bg-cyan-600 text-white" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
              >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? "Uploading..." : "Add to PersonalVault"}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
