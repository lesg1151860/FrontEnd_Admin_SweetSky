"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftIcon, CalendarIcon } from "lucide-react"
import type { Promotion, Presentation, Product } from "@/lib/types"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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
const initialPromotions: Promotion[] = [
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
    active: true,
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
]

export default function EditPromotionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<Promotion>>({
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

  const { toast } = useToast()

  // Calcular el precio con descuento
  const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
    return originalPrice - (originalPrice * discountPercentage) / 100
  }

  useEffect(() => {
    // En un caso real, aquí se haría una petición al backend
    // Por ahora, simulamos la obtención de la promoción
    const foundPromotion = initialPromotions.find((p) => p.id === params.id)
    if (foundPromotion) {
      setPromotion(foundPromotion)
      setFormData({
        title: foundPromotion.title,
        presentationId: foundPromotion.presentationId,
        discountPercentage: foundPromotion.discountPercentage,
        originalPrice: foundPromotion.originalPrice,
        discountedPrice: foundPromotion.discountedPrice,
        twoForOneToppings: foundPromotion.twoForOneToppings,
        twoForOneSauces: foundPromotion.twoForOneSauces,
        active: foundPromotion.active,
        startDate: foundPromotion.startDate,
        endDate: foundPromotion.endDate,
      })
    }
    setLoading(false)
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "discountPercentage") {
      const percentage = Number(value)
      const originalPrice = formData.originalPrice || 0
      const discountedPrice = calculateDiscountedPrice(originalPrice, percentage)

      setFormData({
        ...formData,
        discountPercentage: percentage,
        discountedPrice,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handlePresentationChange = (value: string) => {
    const selectedPresentation = presentations.find((p) => p.id === value)
    if (selectedPresentation) {
      const discountPercentage = formData.discountPercentage || 0
      const originalPrice = selectedPresentation.price
      const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage)

      setFormData({
        ...formData,
        presentationId: value,
        originalPrice,
        discountedPrice,
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "startDate" | "endDate") => {
    const date = e.target.value ? new Date(e.target.value) : null
    setFormData({
      ...formData,
      [field]: date,
    })
  }

  const handleSave = () => {
    if (!formData.title || !formData.presentationId || formData.discountPercentage === undefined) {
      toast({
        title: "Error",
        description: "Todos los campos marcados son obligatorios",
        variant: "destructive",
      })
      return
    }

    // En un caso real, aquí se enviarían los cambios al backend
    toast({
      title: "Promoción actualizada",
      description: "La promoción ha sido actualizada correctamente",
    })
    router.push("/promociones")
  }

  const handleCancel = () => {
    router.push("/promociones")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!promotion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/promociones")} className="mr-2">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Promoción no encontrada</h1>
        </div>
        <p>La promoción que intentas editar no existe.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/promociones")} className="mr-2">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Promoción</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Promoción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={promotion.id} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Promoción *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentation">Presentación *</Label>
              <Select value={formData.presentationId} onValueChange={handlePresentationChange}>
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
                    value={formData.discountPercentage}
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
                    ${formData.discountedPrice?.toLocaleString() || 0}
                  </div>
                  {formData.originalPrice ? (
                    <div className="text-sm text-muted-foreground line-through">
                      ${formData.originalPrice.toLocaleString()}
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
                    checked={formData.twoForOneToppings}
                    onCheckedChange={(checked) => handleCheckboxChange("twoForOneToppings", checked === true)}
                  />
                  <Label htmlFor="twoForOneToppings" className="text-sm">
                    2x1 en Toppings
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="twoForOneSauces"
                    checked={formData.twoForOneSauces}
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
                  value={formData.startDate ? formData.startDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => handleDateChange(e, "startDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin (opcional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate ? formData.endDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => handleDateChange(e, "endDate")}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    active: checked,
                  })
                }}
              />
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
              {formData.presentationId && (
                <>
                  <Image
                    src={presentations.find((p) => p.id === formData.presentationId)?.imageUrl || "/placeholder.svg"}
                    alt="Vista previa"
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute top-0 right-0 bg-sweetBrown text-white px-3 py-1 m-2 rounded-full text-sm font-bold">
                    {formData.discountPercentage}% OFF
                  </div>
                </>
              )}
            </div>
            <div className="space-y-4 w-full">
              <div>
                <h3 className="font-bold text-lg">{formData.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {presentations.find((p) => p.id === formData.presentationId)?.name}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-sweetBrown">
                  ${formData.discountedPrice?.toLocaleString() || 0}
                </div>
                {formData.originalPrice ? (
                  <div className="text-sm text-muted-foreground line-through">
                    ${formData.originalPrice.toLocaleString()}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.twoForOneToppings && (
                  <span className="bg-secondary/30 text-primary px-2 py-1 rounded-md text-xs">2x1 en Toppings</span>
                )}
                {formData.twoForOneSauces && (
                  <span className="bg-secondary/30 text-primary px-2 py-1 rounded-md text-xs">2x1 en Salsas</span>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formData.startDate && <>Desde: {format(formData.startDate, "dd/MM/yyyy", { locale: es })}</>}
                {formData.endDate && (
                  <>
                    <span className="mx-1">-</span>
                    Hasta: {format(formData.endDate, "dd/MM/yyyy", { locale: es })}
                  </>
                )}
              </div>
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
