"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard immediately
    router.push("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Oil Inventory Dashboard</h1>
        <p className="text-muted-foreground mb-4">Redirecting to dashboard...</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}
