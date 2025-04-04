"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon } from "lucide-react"
import type { Sauce } from "@/lib/types"

// Datos de ejemplo
const initialSauces: Sauce[] = [
  { id: 1, name: "Chocolate", active: true },
  { id: 2, name: "Fresa", active: true },
  { id: 3, name: "Caramelo", active: false },
  { id: 4, name: "Arequipe", active: true },
]

export default function EditSaucePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [sauce, setSauce] = useState<Sauce | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    active: false,
  })

  useEffect(() => {
    // En un caso real, aquí se haría una petición al backend
    // Por ahora, simulamos la obtención de la salsa
    const foundSauce = initialSauces.find((s) => s.id === Number.parseInt(params.id))
    if (foundSauce) {
      setSauce(foundSauce)
      setFormData({
        name: foundSauce.name,
        active: foundSauce.active,
      })
    }
    setLoading(false)
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      active: checked,
    })
  }

  const handleSave = () => {
    // En un caso real, aquí se enviarían los cambios al backend
    // Por ahora, simulamos la actualización
    alert(`Salsa actualizada: ${formData.name} - Estado: ${formData.active ? "Activo" : "Inactivo"}`)
    router.push("/salsas")
  }

  const handleCancel = () => {
    router.push("/salsas")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!sauce) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/salsas")} className="mr-2">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Salsa no encontrada</h1>
        </div>
        <p>La salsa que intentas editar no existe.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/salsas")} className="mr-2">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Salsa</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Salsa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={sauce.id} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="active">{formData.active ? "Activo" : "Inactivo"}</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

