"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CakeSlice, ChefHat, Coffee, DollarSign, FileText, Home, Menu, Package, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Productos",
    href: "/dashboard/productos",
    icon: <CakeSlice className="h-5 w-5" />,
  },
  {
    title: "Salsas",
    href: "/dashboard/salsas",
    icon: <Coffee className="h-5 w-5" />,
  },
  {
    title: "Toppings",
    href: "/dashboard/toppings",
    icon: <ChefHat className="h-5 w-5" />,
  },
  {
    title: "Presentaciones",
    href: "/dashboard/presentaciones",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Movimientos",
    href: "/dashboard/movimientos",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Reportes",
    href: "/dashboard/reportes",
    icon: <FileText className="h-5 w-5" />,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Actualizar los estilos para usar los colores del logo
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src="/logo.png" alt="Sweet Sky Logo" fill className="object-contain" />
            </div>
            <span className="text-lg font-bold text-sweetBrown">Sweet Sky</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-sweetPink/20 text-sweetBrown"
                  : "text-muted-foreground hover:bg-sweetPink/10 hover:text-sweetBrown",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

