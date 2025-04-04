"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const storedUser = localStorage.getItem("sweetSkyUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // En un caso real, aquí se haría la autenticación con un backend
      // Por ahora, simulamos una autenticación exitosa si el email es admin@sweetsky.com y la contraseña es admin
      if (email === "admin@sweetsky.com" && password === "admin") {
        const user = { id: "1", email, name: "Administrador" }
        setUser(user)
        localStorage.setItem("sweetSkyUser", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        throw new Error("Credenciales inválidas")
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sweetSkyUser")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

