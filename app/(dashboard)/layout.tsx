"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { MainNav } from "@/components/main-nav"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login")
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-16 border-b">
          <div className="relative h-10 w-10 mr-2">
            <Image src="/placeholder.svg?height=40&width=40" alt="Sweet Sky Logo" fill className="rounded-full" />
          </div>
          <h1 className="text-xl font-bold text-primary">Sweet Sky Admin</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <MainNav />
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-16 items-center bg-white border-b px-4 md:px-6">
          <div className="md:hidden mr-4">{/* Menú móvil aquí */}</div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="text-sm font-medium">{user?.name}</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/10">{children}</main>
      </div>
    </div>
  )
}

