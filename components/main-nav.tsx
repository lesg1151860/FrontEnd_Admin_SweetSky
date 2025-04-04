"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { CakeIcon, SoupIcon, CandyIcon, PackageIcon, BarChart3Icon, FileTextIcon, LogOutIcon } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <CakeIcon className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/productos",
      label: "Productos",
      icon: <CakeIcon className="mr-2 h-4 w-4" />,
      active: pathname === "/productos",
    },
    {
      href: "/salsas",
      label: "Salsas",
      icon: <SoupIcon className="mr-2 h-4 w-4" />,
      active: pathname === "/salsas",
    },
    {
      href: "/toppings",
      label: "Toppings",
      icon: <CandyIcon className="mr-2 h-4 w-4" />,
      active: pathname === "/toppings",
    },
    {
      href: "/presentaciones",
      label: "Presentaciones",
      icon: <PackageIcon className="mr-2 h-4 w-4" />,
      active: pathname === "/presentaciones",
    },
    {
      href: "/movimientos",
      label: "Movimientos",
      icon: <BarChart3Icon className="mr-2 h-4 w-4" />,
      active: pathname === "/movimientos",
    },
    {
      href: "/reportes",
      label: "Reportes",
      icon: <FileTextIcon className="mr-2 h-4 w-4" />,
      active: pathname === "/reportes",
    },
  ]

  return (
    <nav className="flex flex-col h-full">
      <div className="flex flex-col space-y-1 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors",
              route.active ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}
      </div>
      <Button
        variant="ghost"
        className="flex items-center justify-start px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors mt-auto"
        onClick={logout}
      >
        <LogOutIcon className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>
    </nav>
  )
}

