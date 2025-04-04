"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, PencilIcon, ToggleLeftIcon } from "lucide-react"
import type { Presentation, Product } from "@/lib/types"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

export default function PresentacionesPage() {
  const router = useRouter()
  const [presentations, setPresentations] = useState<Presentation[]>(initialPresentations)
  const [newPresentation, setNewPresentation] = useState<Partial<Presentation>>({
    productId: "",
    quantity: 1,
    price: 0,
    description: "",
    active: true,
  })
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)

  const handleToggleActive = (id: string) => {
    setPresentations(
      presentations.map((presentation) =>
        presentation.id === id ? { ...presentation, active: !presentation.active } : presentation,
      ),
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPresentation({
      ...newPresentation,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setNewPresentation({
      ...newPresentation,
      productId: value,
      product: products.find((p) => p.id === value),
    })
  }

  const handleAddPresentation = () => {
    if (newPresentation.productId && newPresentation.quantity && newPresentation.price && newPresentation.description) {
      if (editMode && currentId) {
        setPresentations(
          presentations.map((presentation) =>
            presentation.id === currentId
              ? {
                  ...presentation,
                  ...newPresentation,
                  product: products.find((p) => p.id === newPresentation.productId) as Product,
                }
              : presentation,
          ),
        )
      } else {
        const newId = (presentations.length + 1).toString()
        setPresentations([
          ...presentations,
          {
            id: newId,
            productId: newPresentation.productId as string,
            product: products.find((p) => p.id === newPresentation.productId) as Product,
            quantity: newPresentation.quantity as number,
            price: newPresentation.price as number,
            description: newPresentation.description as string,
            imageUrl: "/placeholder.svg?height=200&width=200",
            active: true,
          },
        ])
      }

      setNewPresentation({
        productId: "",
        quantity: 1,
        price: 0,
        description: "",
        active: true,
      })
      setOpen(false)
      setEditMode(false)
      setCurrentId(null)
    }
  }

  const handleEdit = (presentation: Presentation) => {
    setNewPresentation({
      productId: presentation.productId,
      quantity: presentation.quantity,
      price: presentation.price,
      description: presentation.description,
      active: presentation.active,
    })
    setEditMode(true)
    setCurrentId(presentation.id)
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Presentaciones</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Presentación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "Editar" : "Crear Nueva"} Presentación</DialogTitle>
              <DialogDescription>Complete los detalles de la presentación.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                <Select value={newPresentation.productId} onValueChange={handleSelectChange}>
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
                  value={newPresentation.quantity}
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
                  value={newPresentation.price}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newPresentation.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Imagen</Label>
                <Input id="image" type="file" accept="image/*" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setEditMode(false)
                  setCurrentId(null)
                  setNewPresentation({
                    productId: "",
                    quantity: 1,
                    price: 0,
                    description: "",
                    active: true,
                  })
                }}
              >
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleAddPresentation}>
                {editMode ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presentations.map((presentation) => (
          <Card key={presentation.id} className={presentation.active ? "" : "opacity-60"}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{presentation.product.name}</CardTitle>
              <CardDescription>Cantidad: {presentation.quantity}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="aspect-square relative mb-4">
                <Image
                  src={presentation.imageUrl || "/placeholder.svg"}
                  alt={presentation.product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <p className="text-sm mb-2">{presentation.description}</p>
              <p className="font-bold text-lg">${presentation.price.toLocaleString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Button variant="outline" size="sm" onClick={() => router.push(`/presentaciones/${presentation.id}`)}>
                <PencilIcon className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                variant={presentation.active ? "destructive" : "default"}
                size="sm"
                onClick={() => handleToggleActive(presentation.id)}
              >
                <ToggleLeftIcon className="h-4 w-4 mr-1" />
                {presentation.active ? "Desactivar" : "Activar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

