"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LogOut, User } from "lucide-react"
import Image from "next/image"

export function Header() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("sweetSkyAuth")
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12">
          <Image src="/logo.png" alt="Sweet Sky Logo" fill className="object-contain" />
        </div>
        <h1 className="text-xl font-bold text-sweetBrown">Sweet Sky Admin</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-sweetBrown" />
          <span className="text-sm font-medium">Administrador</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-sweetBrown hover:bg-sweetPink/20 hover:text-sweetBrown"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  )
}

