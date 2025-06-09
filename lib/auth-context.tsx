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

// Arreglo de usuarios predeterminados
const predefinedUsers = [
  { id: "1", email: "admin@sweetsky.com", password: "admin", name: "Administrador" },
  { id: "2", email: "user1@sweetsky.com", password: "user1pass", name: "Usuario 1" },
  { id: "3", email: "user2@sweetsky.com", password: "user2pass", name: "Usuario 2" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("sweetSkyUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Verificar si las credenciales coinciden con algún usuario predeterminado
      const foundUser = predefinedUsers.find(
        (user) => user.email === email && user.password === password
      )
      if (foundUser) {
        const { id, email, name } = foundUser
        const user = { id, email, name }
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

