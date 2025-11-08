"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import DashboardPage from "@/components/dashboard-page"

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

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userItems, setUserItems] = useState<KnowledgeItem[]>([])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserItems([])
  }

  const handleAddItem = (newItem: Omit<KnowledgeItem, "id" | "date">) => {
    const item: KnowledgeItem = {
      ...newItem,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    }
    setUserItems([item, ...userItems])
  }

  const handleDeleteItem = (id: string) => {
    setUserItems(userItems.filter((item) => item.id !== id))
  }

  return isLoggedIn ? (
    <DashboardPage
      onLogout={handleLogout}
      userItems={userItems}
      onAddItem={handleAddItem}
      onDeleteItem={handleDeleteItem}
    />
  ) : (
    <LoginPage onLogin={handleLogin} />
  )
}
