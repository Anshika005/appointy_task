"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="text-center mb-8 absolute top-8">
        <h1 className="text-4xl font-bold mb-2">Synapse</h1>
        <p className="text-muted-foreground">Your visual memory of the web</p>
      </div>
      <AuthForm />
    </main>
  )
}
