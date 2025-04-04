"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
    } catch (err) {
      setError("Credenciales inválidas. Por favor, intente de nuevo.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sweetPink/20">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="w-32 h-32 relative mx-auto mb-4">
            <Image src="/logo.png" alt="Sweet Sky Logo" fill className="object-contain" />
          </div>
          <CardTitle className="text-2xl text-sweetBrown">Sweet Sky Admin</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-sweetBrown hover:bg-sweetBrown/90 text-white"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">© {new Date().getFullYear()} Sweet Sky Pastelería</p>
        </CardFooter>
      </Card>
    </div>
  )
}

