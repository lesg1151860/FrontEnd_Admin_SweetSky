"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftIcon } from "lucide-react"
import type { Presentation, Product } from "@/lib/types"
import Image from "next/image"

// Datos de ejemplo
const products: Product[] = [
  { id: "1", name: "Torta de Chocolate", active: true },
  { id: "2", name: "Cupcake de Vainilla", active: true },
  { id: "3", name: "Galletas de Avena", active: true },
  { id: "4", name: "Brownie", active: true },
]

const initialPresentations: Presentation[] = [
  {
    id: "1",
    productId: "1",
    product: products[0],
    quantity: 1,
    price: 45000,
    description: "Deliciosa torta de chocolate para 10 personas",
    imageUrl: "/placeholder.svg?height=200&width=200",
    active: true,
  },
  {
    id: "2",
    productId: "2",
    product: products[1],
    quantity: 12,
    price: 35000,
    description: "Docena de cupcakes de vainilla con frosting",
    imageUrl: "/placeholder.svg?height=200&width=200",
    active: true,
  },
  {
    id: "3",
    productId: "3",
    product: products[2],
    quantity: 24,
    price: 18000,
    description: "Paquete de 24 galletas de avena con pasas",
    imageUrl: "/placeholder.svg?height=200&width=200",
    active: false,
  },
]

export default function EditPresentationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    price: 0,
    description: "",
    active: false,
  })

  useEffect(() => {
    // En un caso real, aquí se haría una petición al backend
    // Por ahora, simulamos la obtención de la presentación
    const foundPresentation = initialPresentations.find((p) => p.id === params.id)
    if (foundPresentation) {
      setPresentation(foundPresentation)
      setFormData({
        productId: foundPresentation.productId,
        quantity: foundPresentation.quantity,
        price: foundPresentation.price,
        description: foundPresentation.description,
        active: foundPresentation.active,
      })
    }
    setLoading(false)
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      productId: value,
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
    alert(
      `Presentación actualizada: ${products.find((p) => p.id === formData.productId)?.name} - Precio: $${formData.price}`,
    )
    router.push("/presentaciones")
  }

  const handleCancel = () => {
    router.push("/presentaciones")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!presentation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/presentaciones")} className="mr-2">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Presentación no encontrada</h1>
        </div>
        <p>La presentación que intentas editar no existe.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/presentaciones")} className="mr-2">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Presentación</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Presentación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={presentation.id} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Producto</Label>
              <Select value={formData.productId} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products
                    .filter((p) => p.active)
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
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

        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="aspect-square relative w-full max-w-[300px] mb-4">
              <Image
                src={presentation.imageUrl || "/placeholder.svg"}
                alt="Vista previa"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="space-y-2 w-full">
              <h3 className="font-bold text-lg">
                {products.find((p) => p.id === formData.productId)?.name || "Producto"}
              </h3>
              <p className="text-sm text-muted-foreground">Cantidad: {formData.quantity}</p>
              <p className="text-sm">{formData.description}</p>
              <p className="font-bold text-lg">${formData.price.toLocaleString()}</p>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    formData.active ? "bg-success/20 text-success" : "bg-error/20 text-error"
                  }`}
                >
                  {formData.active ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

