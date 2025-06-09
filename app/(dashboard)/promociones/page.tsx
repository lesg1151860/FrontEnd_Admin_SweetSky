"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { PlusIcon, PencilIcon, ToggleLeftIcon, FilterIcon, TagIcon, CalendarIcon } from "lucide-react"
import type { Promotion, Presentation, Product } from "@/lib/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo para las presentaciones
const products: Product[] = [
  { id: "1", name: "Torta de Chocolate", active: true },
  { id: "2", name: "Cupcake de Vainilla", active: true },
  { id: "3", name: "Galletas de Avena", active: true },
  { id: "4", name: "Brownie", active: true },
  { id: "5", name: "Donitas", active: true },
  { id: "6", name: "Pastel de Fresa", active: true },
]

const presentations: Presentation[] = [
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
    active: true,
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
]

// Datos de ejemplo para las promociones
export const initialPromotions: Promotion[] = [
  {
    id: "1",
    title: "Oferta Especial Torta de Chocolate",
    presentationId: "1",
    presentation: presentations[0],
    discountPercentage: 15,
    originalPrice: 45000,
    discountedPrice: 38250,
    twoForOneToppings: true,
    twoForOneSauces: false,
    active: false,
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 3, 15),
  },
  {
    id: "2",
    title: "Promoción Cupcakes",
    presentationId: "2",
    presentation: presentations[1],
    discountPercentage: 10,
    originalPrice: 35000,
    discountedPrice: 31500,
    twoForOneToppings: false,
    twoForOneSauces: true,
    active: true,
    startDate: new Date(2025, 3, 5),
    endDate: null,
  },
  {
    id: "3",
    title: "Descuento en Galletas de Avena",
    presentationId: "3",
    presentation: presentations[2],
    discountPercentage: 20,
    originalPrice: 18000,
    discountedPrice: 14400,
    twoForOneToppings: false,
    twoForOneSauces: false,
    active: true,
    startDate: new Date(2025, 3, 10),
    endDate: new Date(2025, 3, 20),
  },
  {
    id: "4",
    title: "Promoción Donitas Glaseadas",
    presentationId: "4",
    presentation: presentations[3],
    discountPercentage: 25,
    originalPrice: 12000,
    discountedPrice: 9000,
    twoForOneToppings: true,
    twoForOneSauces: false,
    active: true,
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 3, 30),
  },
  {
    id: "5",
    title: "Oferta Especial Cupcakes y Donitas",
    presentationId: "2",
    presentation: presentations[1],
    discountPercentage: 30,
    originalPrice: 35000,
    discountedPrice: 24500,
    twoForOneToppings: true,
    twoForOneSauces: true,
    active: false,
    startDate: new Date(2025, 3, 20),
    endDate: null,
  },
]

export default function PromocionesPage() {
  const router = useRouter()
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    title: "",
    presentationId: "",
    discountPercentage: 0,
    originalPrice: 0,
    discountedPrice: 0,
    twoForOneToppings: false,
    twoForOneSauces: false,
    active: true,
    startDate: new Date(),
    endDate: null,
  })
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)

  // Estado para filtrar por estado (activo/inactivo)
  const [statusFilter, setStatusFilter] = useState<"todos" | "activo" | "inactivo">("todos")

  const { toast } = useToast()

  // Filtrar promociones según el estado seleccionado
  const filteredPromotions = useMemo(() => {
    if (statusFilter === "todos") {
      return promotions
    }
    return promotions.filter((p) => (statusFilter === "activo" ? p.active : !p.active))
  }, [promotions, statusFilter])

  // Calcular el precio con descuento
  const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
    return originalPrice - (originalPrice * discountPercentage) / 100
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "discountPercentage") {
      const percentage = Number(value)
      const originalPrice = newPromotion.originalPrice || 0
      const discountedPrice = calculateDiscountedPrice(originalPrice, percentage)

      setNewPromotion({
        ...newPromotion,
        discountPercentage: percentage,
        discountedPrice,
      })
    } else {
      setNewPromotion({
        ...newPromotion,
        [name]: value,
      })
    }
  }

  const handlePresentationChange = (value: string) => {
    const selectedPresentation = presentations.find((p) => p.id === value)
    if (selectedPresentation) {
      const discountPercentage = newPromotion.discountPercentage || 0
      const originalPrice = selectedPresentation.price
      const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage)

      setNewPromotion({
        ...newPromotion,
        presentationId: value,
        presentation: selectedPresentation,
        originalPrice,
        discountedPrice,
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewPromotion({
      ...newPromotion,
      [name]: checked,
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "startDate" | "endDate") => {
    const date = e.target.value ? new Date(e.target.value) : null
    setNewPromotion({
      ...newPromotion,
      [field]: date,
    })
  }

  const handleToggleActive = (id: string) => {
    setPromotions(
      promotions.map((promotion) => (promotion.id === id ? { ...promotion, active: !promotion.active } : promotion)),
    )
    toast({
      title: "Estado actualizado",
      description: "El estado de la promoción ha sido actualizado correctamente",
    })
  }

  const handleAddOrUpdatePromotion = () => {
    if (!newPromotion.title || !newPromotion.presentationId || newPromotion.discountPercentage === undefined) {
      toast({
        title: "Error",
        description: "Todos los campos marcados son obligatorios",
        variant: "destructive",
      })
      return
    }

    if (editMode && currentId) {
      // Actualizar promoción existente
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === currentId
            ? {
                ...promotion,
                ...newPromotion,
                presentation: presentations.find((p) => p.id === newPromotion.presentationId) as Presentation,
              }
            : promotion,
        ),
      )
      toast({
        title: "Promoción actualizada",
        description: "La promoción ha sido actualizada correctamente",
      })
    } else {
      // Crear nueva promoción
      const newId = (promotions.length + 1).toString()
      setPromotions([
        ...promotions,
        {
          id: newId,
          title: newPromotion.title as string,
          presentationId: newPromotion.presentationId as string,
          presentation: presentations.find((p) => p.id === newPromotion.presentationId) as Presentation,
          discountPercentage: newPromotion.discountPercentage as number,
          originalPrice: newPromotion.originalPrice as number,
          discountedPrice: newPromotion.discountedPrice as number,
          twoForOneToppings: newPromotion.twoForOneToppings as boolean,
          twoForOneSauces: newPromotion.twoForOneSauces as boolean,
          active: newPromotion.active as boolean,
          startDate: newPromotion.startDate as Date,
          endDate: newPromotion.endDate ?? null,
        },
      ])
      toast({
        title: "Promoción creada",
        description: "La promoción ha sido creada correctamente",
      })
    }

    // Resetear el formulario y cerrar el diálogo
    setNewPromotion({
      title: "",
      presentationId: "",
      discountPercentage: 0,
      originalPrice: 0,
      discountedPrice: 0,
      twoForOneToppings: false,
      twoForOneSauces: false,
      active: true,
      startDate: new Date(),
      endDate: null,
    })
    setOpen(false)
    setEditMode(false)
    setCurrentId(null)
  }

  const handleEdit = (promotion: Promotion) => {
    setNewPromotion({
      title: promotion.title,
      presentationId: promotion.presentationId,
      presentation: promotion.presentation,
      discountPercentage: promotion.discountPercentage,
      originalPrice: promotion.originalPrice,
      discountedPrice: promotion.discountedPrice,
      twoForOneToppings: promotion.twoForOneToppings,
      twoForOneSauces: promotion.twoForOneSauces,
      active: promotion.active,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
    })
    setEditMode(true)
    setCurrentId(promotion.id)
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Promociones</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <PlusIcon className="mr-2 h-4 w-4" /> Nueva Promoción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "Editar" : "Crear Nueva"} Promoción</DialogTitle>
              <DialogDescription>Complete los detalles de la promoción.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Promoción *</Label>
                <Input
                  id="title"
                  name="title"
                  value={newPromotion.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Oferta Especial Torta de Chocolate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="presentation">Presentación *</Label>
                <Select value={newPromotion.presentationId} onValueChange={handlePresentationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una presentación" />
                  </SelectTrigger>
                  <SelectContent>
                    {presentations
                      .filter((p) => p.active)
                      .map((presentation) => (
                        <SelectItem key={presentation.id} value={presentation.id}>
                          {presentation.name} - ${presentation.price.toLocaleString()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Porcentaje de Descuento *</Label>
                  <div className="relative">
                    <Input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      value={newPromotion.discountPercentage}
                      onChange={handleInputChange}
                      min={0}
                      max={100}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Precio con Descuento</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <div className="text-lg font-bold text-sweetBrown">
                      ${newPromotion.discountedPrice?.toLocaleString() || 0}
                    </div>
                    {newPromotion.originalPrice ? (
                      <div className="text-sm text-muted-foreground line-through">
                        ${newPromotion.originalPrice.toLocaleString()}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Promociones Adicionales</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twoForOneToppings"
                      checked={newPromotion.twoForOneToppings}
                      onCheckedChange={(checked) => handleCheckboxChange("twoForOneToppings", checked === true)}
                    />
                    <Label htmlFor="twoForOneToppings" className="text-sm">
                      2x1 en Toppings
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="twoForOneSauces"
                      checked={newPromotion.twoForOneSauces}
                      onCheckedChange={(checked) => handleCheckboxChange("twoForOneSauces", checked === true)}
                    />
                    <Label htmlFor="twoForOneSauces" className="text-sm">
                      2x1 en Salsas
                    </Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newPromotion.startDate ? newPromotion.startDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => handleDateChange(e, "startDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin (opcional)</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newPromotion.endDate ? newPromotion.endDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => handleDateChange(e, "endDate")}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newPromotion.active}
                  onCheckedChange={(checked) => {
                    setNewPromotion({
                      ...newPromotion,
                      active: checked,
                    })
                  }}
                />
                <Label htmlFor="active">{newPromotion.active ? "Activo" : "Inactivo"}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setEditMode(false)
                  setCurrentId(null)
                  setNewPromotion({
                    title: "",
                    presentationId: "",
                    discountPercentage: 0,
                    originalPrice: 0,
                    discountedPrice: 0,
                    twoForOneToppings: false,
                    twoForOneSauces: false,
                    active: true,
                    startDate: new Date(),
                    endDate: null,
                  })
                }}
              >
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleAddOrUpdatePromotion}>
                {editMode ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro de estado */}
      <div className="flex items-center space-x-2 bg-white p-4 rounded-md border">
        <FilterIcon className="h-5 w-5 text-sweetBrown" />
        <div className="font-medium text-sm">Filtrar por estado:</div>
        <div className="w-64">
          <Select
            value={statusFilter}
            onValueChange={(value: "todos" | "activo" | "inactivo") => setStatusFilter(value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Seleccione un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las promociones</SelectItem>
              <SelectItem value="activo">Promociones activas</SelectItem>
              <SelectItem value="inactivo">Promociones inactivas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {statusFilter !== "todos" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter("todos")}
            className="text-xs text-muted-foreground"
          >
            Limpiar filtro
          </Button>
        )}
      </div>

      {filteredPromotions.length === 0 ? (
        <div className="text-center p-8 bg-muted/20 rounded-md">
          <p className="text-muted-foreground">No hay promociones disponibles para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPromotions.map((promotion) => (
            <Card key={promotion.id} className={promotion.active ? "" : "opacity-60"}>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{promotion.title}</CardTitle>
                    <CardDescription>{promotion.presentation.name}</CardDescription>
                  </div>
                  <div className="bg-sweetBrown text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {promotion.discountPercentage}% OFF
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4">
                  <Image
                    src={promotion.presentation.imageUrl || "/placeholder.svg"}
                    alt={promotion.presentation.name}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute top-0 right-0 bg-sweetBrown text-white px-3 py-1 m-2 rounded-full text-sm font-bold">
                    {promotion.discountPercentage}% OFF
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-sweetBrown">
                      ${promotion.discountedPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground line-through">
                      ${promotion.originalPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {promotion.twoForOneToppings && (
                      <span className="bg-secondary/30 text-primary px-2 py-1 rounded-md text-xs">2x1 en Toppings</span>
                    )}
                    {promotion.twoForOneSauces && (
                      <span className="bg-secondary/30 text-primary px-2 py-1 rounded-md text-xs">2x1 en Salsas</span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Desde: {format(promotion.startDate, "dd/MM/yyyy", { locale: es })}
                    {promotion.endDate && (
                      <>
                        <span className="mx-1">-</span>
                        Hasta: {format(promotion.endDate, "dd/MM/yyyy", { locale: es })}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" size="sm" onClick={() => handleEdit(promotion)}>
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant={promotion.active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleActive(promotion.id)}
                >
                  <ToggleLeftIcon className="h-4 w-4 mr-1" />
                  {promotion.active ? "Desactivar" : "Activar"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
