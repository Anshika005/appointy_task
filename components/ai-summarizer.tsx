"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, X } from "lucide-react"

interface AISummarizerProps {
  url: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export function AISummarizer({ url, title, isOpen, onClose }: AISummarizerProps) {
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)

  const handleSummarize = async () => {
    try {
      setIsLoading(true)
      setHasRequested(true)
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title }),
      })

      if (response.ok) {
        const data = await response.json()
        setSummary(data.summary)
      }
    } catch (error) {
      console.error("Summarize error:", error)
      setSummary("Failed to generate summary")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">AI Summary</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>

          {!hasRequested ? (
            <Button onClick={handleSummarize} className="w-full">
              Generate Summary
            </Button>
          ) : isLoading ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Generating summary...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-accent/10 rounded-md p-4">
                <p className="text-sm leading-relaxed">{summary}</p>
              </div>
              <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
                Close
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
