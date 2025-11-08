"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface SearchResult {
  id: string
  title: string
  reason: string
}

interface AISearchProps {
  isOpen: boolean
  onClose: () => void
  onSelectResult?: (id: string) => void
}

export function AISearch({ isOpen, onClose, onSelectResult }: AISearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { token } = useAuth()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setIsSearching(true)
      setHasSearched(true)
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">AI-Powered Search</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="p-6 border-b flex gap-3">
          <Input
            placeholder="Search using natural language... e.g., 'articles about AI from last week'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isSearching}
            className="flex-1"
          />
          <Button disabled={isSearching} type="submit">
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        <div className="flex-1 overflow-y-auto p-6">
          {!hasSearched ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Try asking questions like:</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>{'"Show me articles about React I saved"'}</li>
                <li>{'"Find product recommendations under $50"'}</li>
                <li>{'"My to-do lists from this week"'}</li>
              </ul>
            </div>
          ) : isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-muted-foreground">Searching...</div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No matches found for your query.</div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <Card
                  key={result.id}
                  className="p-4 hover:bg-muted cursor-pointer transition"
                  onClick={() => {
                    onSelectResult?.(result.id)
                    onClose()
                  }}
                >
                  <p className="font-medium text-foreground">{result.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{result.reason}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
