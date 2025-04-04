"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

interface Producto {
  id: number
  nombre: string
  estado: boolean
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: "Torta de Chocolate", estado: true },
    { id: 2, nombre: "Cupcake de Vainilla", estado: true },
    { id: 3, nombre: "Pastel de Fresa", estado: false },
    { id: 4, nombre: "Galletas Decoradas", estado: true },
    { id: 5, nombre: "Brownie", estado: true },
  ])
  const [nuevoProducto, setNuevoProducto] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleEstado = (id: number) => {
    setProductos(
      productos.map((producto) => (producto.id === id ? { ...producto, estado: !producto.estado } : producto)),
    )
    toast({
      title: "Estado actualizado",
      description: "El estado del producto ha sido actualizado correctamente",
    })
  }

  const handleCrearProducto = () => {
    if (!nuevoProducto.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    const nuevoId = Math.max(...productos.map((p) => p.id), 0) + 1
    setProductos([...productos, { id: nuevoId, nombre: nuevoProducto, estado: true }])
    setNuevoProducto("")
    setOpen(false)
    toast({
      title: "Producto creado",
      description: "El producto ha sido creado correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Productos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>Ingresa el nombre del nuevo producto para agregarlo al sistema.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Torta de Chocolate"
                  value={nuevoProducto}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleCrearProducto}>
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="w-[150px]">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-medium">{producto.id}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={producto.estado} onCheckedChange={() => handleToggleEstado(producto.id)} />
                    <span className={producto.estado ? "text-green-600" : "text-red-600"}>
                      {producto.estado ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

