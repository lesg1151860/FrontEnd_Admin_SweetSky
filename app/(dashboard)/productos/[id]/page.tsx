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
import type { Product } from "@/lib/types"

// Datos de ejemplo
const initialProducts: Product[] = [
  { id: "1", name: "Torta de Chocolate", active: true },
  { id: "2", name: "Cupcake de Vainilla", active: true },
  { id: "3", name: "Galletas de Avena", active: false },
  { id: "4", name: "Brownie", active: true },
]

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    active: false,
  })

  useEffect(() => {
    // En un caso real, aquí se haría una petición al backend
    // Por ahora, simulamos la obtención del producto
    const foundProduct = initialProducts.find((p) => p.id === params.id)
    if (foundProduct) {
      setProduct(foundProduct)
      setFormData({
        name: foundProduct.name,
        active: foundProduct.active,
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
    alert(`Producto actualizado: ${formData.name} - Estado: ${formData.active ? "Activo" : "Inactivo"}`)
    router.push("/productos")
  }

  const handleCancel = () => {
    router.push("/productos")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/productos")} className="mr-2">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Producto no encontrado</h1>
        </div>
        <p>El producto que intentas editar no existe.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/productos")} className="mr-2">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Producto</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={product.id} disabled />
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

