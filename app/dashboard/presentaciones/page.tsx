"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Edit, Plus, ToggleLeft } from "lucide-react"

interface Producto {
  id: number
  nombre: string
}

interface Presentacion {
  id: number
  productoId: number
  productoNombre: string
  cantidad: number
  precio: number
  descripcion: string
  imagen: string
  estado: boolean
}

export default function PresentacionesPage() {
  const [productos] = useState<Producto[]>([
    { id: 1, nombre: "Torta de Chocolate" },
    { id: 2, nombre: "Cupcake de Vainilla" },
    { id: 3, nombre: "Pastel de Fresa" },
    { id: 4, nombre: "Galletas Decoradas" },
    { id: 5, nombre: "Brownie" },
  ])

  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([
    {
      id: 1,
      productoId: 1,
      productoNombre: "Torta de Chocolate",
      cantidad: 1,
      precio: 45000,
      descripcion: "Deliciosa torta de chocolate con cobertura de ganache",
      imagen: "/placeholder.svg?height=200&width=200",
      estado: true,
    },
    {
      id: 2,
      productoId: 2,
      productoNombre: "Cupcake de Vainilla",
      cantidad: 12,
      precio: 36000,
      descripcion: "Docena de cupcakes de vainilla con frosting de colores",
      imagen: "/placeholder.svg?height=200&width=200",
      estado: true,
    },
    {
      id: 3,
      productoId: 3,
      productoNombre: "Pastel de Fresa",
      cantidad: 1,
      precio: 52000,
      descripcion: "Pastel de fresa con crema y fresas naturales",
      imagen: "/placeholder.svg?height=200&width=200",
      estado: false,
    },
  ])

  const [nuevaPresentacion, setNuevaPresentacion] = useState({
    productoId: "",
    cantidad: "",
    precio: "",
    descripcion: "",
    imagen: "/placeholder.svg?height=200&width=200",
  })

  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleEstado = (id: number) => {
    setPresentaciones(
      presentaciones.map((presentacion) =>
        presentacion.id === id ? { ...presentacion, estado: !presentacion.estado } : presentacion,
      ),
    )
    toast({
      title: "Estado actualizado",
      description: "El estado de la presentación ha sido actualizado correctamente",
    })
  }

  const handleCrearPresentacion = () => {
    if (
      !nuevaPresentacion.productoId ||
      !nuevaPresentacion.cantidad ||
      !nuevaPresentacion.precio ||
      !nuevaPresentacion.descripcion
    ) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    const productoSeleccionado = productos.find((p) => p.id === Number.parseInt(nuevaPresentacion.productoId))
    if (!productoSeleccionado) return

    const nuevoId = Math.max(...presentaciones.map((p) => p.id), 0) + 1
    setPresentaciones([
      ...presentaciones,
      {
        id: nuevoId,
        productoId: Number.parseInt(nuevaPresentacion.productoId),
        productoNombre: productoSeleccionado.nombre,
        cantidad: Number.parseInt(nuevaPresentacion.cantidad),
        precio: Number.parseInt(nuevaPresentacion.precio),
        descripcion: nuevaPresentacion.descripcion,
        imagen: nuevaPresentacion.imagen,
        estado: true,
      },
    ])

    setNuevaPresentacion({
      productoId: "",
      cantidad: "",
      precio: "",
      descripcion: "",
      imagen: "/placeholder.svg?height=200&width=200",
    })

    setOpen(false)
    toast({
      title: "Presentación creada",
      description: "La presentación ha sido creada correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Presentaciones</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nueva Presentación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Presentación</DialogTitle>
              <DialogDescription>Completa los datos para crear una nueva presentación de producto.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="producto">Producto</Label>
                <Select
                  value={nuevaPresentacion.productoId}
                  onValueChange={(value) => setNuevaPresentacion({ ...nuevaPresentacion, productoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.id} value={producto.id.toString()}>
                        {producto.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  placeholder="Ej: 1"
                  value={nuevaPresentacion.cantidad}
                  onChange={(e) => setNuevaPresentacion({ ...nuevaPresentacion, cantidad: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  placeholder="Ej: 45000"
                  value={nuevaPresentacion.precio}
                  onChange={(e) => setNuevaPresentacion({ ...nuevaPresentacion, precio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe la presentación del producto"
                  value={nuevaPresentacion.descripcion}
                  onChange={(e) => setNuevaPresentacion({ ...nuevaPresentacion, descripcion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imagen">Imagen</Label>
                <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
                  <div className="text-center">
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Aquí iría un selector de imágenes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleCrearPresentacion}>
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presentaciones.map((presentacion) => (
          <Card key={presentacion.id} className={!presentacion.estado ? "opacity-60" : ""}>
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={presentacion.imagen || "/placeholder.svg"}
                  alt={presentacion.productoNombre}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{presentacion.productoNombre}</h3>
                <p className="text-sm text-muted-foreground mb-2">Cantidad: {presentacion.cantidad}</p>
                <p className="text-sm mb-2">{presentacion.descripcion}</p>
                <p className="text-lg font-bold text-sweetBrown">${presentacion.precio.toLocaleString()}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleEstado(presentacion.id)}
                className={presentacion.estado ? "text-green-600" : "text-red-600"}
              >
                <ToggleLeft className="h-4 w-4 mr-2" />
                {presentacion.estado ? "Activo" : "Inactivo"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

