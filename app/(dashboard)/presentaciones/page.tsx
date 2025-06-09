"use client"

import type React from "react"

import { useState, useMemo } from "react"
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
import { PlusIcon, PencilIcon, ToggleLeftIcon, FilterIcon } from "lucide-react"
import type { Presentation, Product } from "@/lib/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"

// Asegurarse de que useToast está importado
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const products: Product[] = [
  { id: "1", name: "Torta de Chocolate", active: true },
  { id: "2", name: "Cupcake de Vainilla", active: true },
  { id: "3", name: "Galletas de Avena", active: true },
  { id: "4", name: "Brownie", active: true },
  { id: "5", name: "Donitas", active: true },
  { id: "6", name: "Pastel de Fresa", active: true },
]

const initialPresentations: Presentation[] = [
  {
    id: "1",
    productId: "1",
    product: products[0],
    name: "Torta Chocolate Premium",
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
    name: "Cupcakes Vainilla Clásicos",
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
    name: "Galletas Avena Familiar",
    quantity: 24,
    price: 18000,
    description: "Paquete de 24 galletas de avena con pasas",
    imageUrl: "/placeholder.svg?height=200&width=200",
    active: false,
  },
  {
    id: "4",
    productId: "5",
    product: products[4],
    name: "Donitas Glaseadas",
    quantity: 6,
    price: 12000,
    description: "Media docena de donitas glaseadas",
    imageUrl: "/placeholder.svg?height=200&width=200",
    active: true,
  },
  {
    id: "5",
    productId: "5",
    product: products[4],
    name: "Donitas Chocolate",
    quantity: 12,
    price: 22000,
    description: "Docena de donitas con chispas de chocolate",
    imageUrl: "/placeholder.svg?height=200&width=200",
    active: true,
  },
  {
    id: "6",
    productId: "6",
    product: products[5],
    name: "Pastel Fresa Grande",
    quantity: 1,
    price: 48000,
    description: "Pastel de fresa con crema para 12 personas",
    imageUrl: "/placeholder.svg?height=200&width=200",
    active: true,
  },
]

export default function PresentacionesPage() {
  const router = useRouter()
  const [presentations, setPresentations] = useState<Presentation[]>(initialPresentations)
  const [newPresentation, setNewPresentation] = useState<Partial<Presentation>>({
    productId: "",
    name: "",
    quantity: 1,
    price: 0,
    description: "",
    active: true,
  })
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)

  // Nuevo estado para el filtro de productos
  const [productFilter, setProductFilter] = useState<string>("todos")

  // Obtener lista única de productos para el filtro
  const uniqueProducts = useMemo(() => {
    const productIds = new Set<string>()
    presentations.forEach((p) => productIds.add(p.productId))

    return [{ id: "todos", name: "Todos los productos" }, ...products.filter((p) => productIds.has(p.id) && p.active)]
  }, [presentations])

  // Filtrar presentaciones según el filtro seleccionado
  const filteredPresentations = useMemo(() => {
    if (productFilter === "todos") {
      return presentations
    }
    return presentations.filter((p) => p.productId === productFilter)
  }, [presentations, productFilter])

  // Añadir el hook useToast
  const { toast } = useToast()

  // Modificar la función handleToggleActive para mostrar notificación
  const handleToggleActive = (id: string) => {
    setPresentations(
      presentations.map((presentation) =>
        presentation.id === id ? { ...presentation, active: !presentation.active } : presentation,
      ),
    )
    toast({
      title: "Estado actualizado",
      description: "El estado de la presentación ha sido actualizado correctamente",
    })
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

  const handleFilterChange = (value: string) => {
    setProductFilter(value)
  }

  // Modificar la función handleAddPresentation para mostrar notificación de éxito o error
  const handleAddPresentation = () => {
    if (!newPresentation.productId || !newPresentation.name || !newPresentation.price || !newPresentation.description) {
      toast({
        title: "Error",
        description: "Todos los campos marcados son obligatorios",
        variant: "destructive",
      })
      return
    }

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
      toast({
        title: "Presentación actualizada",
        description: "La presentación ha sido actualizada correctamente",
      })
    } else {
      const newId = (presentations.length + 1).toString()
      setPresentations([
        ...presentations,
        {
          id: newId,
          productId: newPresentation.productId as string,
          product: products.find((p) => p.id === newPresentation.productId) as Product,
          name: newPresentation.name as string,
          quantity: newPresentation.quantity as number,
          price: newPresentation.price as number,
          description: newPresentation.description as string,
          imageUrl: "/placeholder.svg?height=200&width=200",
          active: newPresentation.active as boolean,
        },
      ])
      toast({
        title: "Presentación creada",
        description: "La presentación ha sido creada correctamente",
      })
    }

    setNewPresentation({
      productId: "",
      name: "",
      quantity: 1,
      price: 0,
      description: "",
      active: true,
    })
    setOpen(false)
    setEditMode(false)
    setCurrentId(null)
  }

  const handleEdit = (presentation: Presentation) => {
    setNewPresentation({
      productId: presentation.productId,
      name: presentation.name,
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
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Presentaciones</h1>
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
                <Label htmlFor="name">Nombre de la Presentación</Label>
                <Input
                  id="name"
                  name="name"
                  value={newPresentation.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Torta Chocolate Premium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Tipo de Producto</Label>
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
                  placeholder="Breve descripción de la presentación"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Imagen (.jpg, .jpeg, .png)</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-sweetBrown transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const files = e.dataTransfer.files
                    if (files && files.length > 0) {
                      // En un caso real, aquí se procesaría la imagen
                      alert(`Imagen "${files[0].name}" seleccionada`)
                    }
                  }}
                >
                  <div className="text-center">
                    <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">Arrastra y suelta una imagen aquí o</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG hasta 5MB</p>
                    <Input
                      id="image"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          // En un caso real, aquí se procesaría la imagen
                          alert(`Imagen "${e.target.files[0].name}" seleccionada`)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        document.getElementById("image")?.click()
                      }}
                    >
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newPresentation.active}
                  onCheckedChange={(checked) => {
                    setNewPresentation({
                      ...newPresentation,
                      active: checked,
                    })
                  }}
                />
                <Label htmlFor="active">{newPresentation.active ? "Activo" : "Inactivo"}</Label>
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
                    name: "",
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

      {/* Filtro de productos */}
      <div className="flex items-center space-x-2 bg-white p-4 rounded-md border">
        <FilterIcon className="h-5 w-5 text-sweetBrown" />
        <div className="font-medium text-sm">Filtrar por producto:</div>
        <div className="w-64">
          <Select value={productFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Seleccione un producto" />
            </SelectTrigger>
            <SelectContent>
              {uniqueProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {productFilter !== "todos" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProductFilter("todos")}
            className="text-xs text-muted-foreground"
          >
            Limpiar filtro
          </Button>
        )}
      </div>

      {filteredPresentations.length === 0 ? (
        <div className="text-center p-8 bg-muted/20 rounded-md">
          <p className="text-muted-foreground">No hay presentaciones disponibles para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresentations.map((presentation) => (
            <Card key={presentation.id} className={presentation.active ? "" : "opacity-60"}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{presentation.name}</CardTitle>
                <CardDescription>
                  {presentation.product.name} - Cantidad: {presentation.quantity}
                </CardDescription>
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
      )}
    </div>
  )
}

