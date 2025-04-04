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

interface Topping {
  id: number
  nombre: string
  estado: boolean
}

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<Topping[]>([
    { id: 1, nombre: "Chispas de Chocolate", estado: true },
    { id: 2, nombre: "Fresas", estado: true },
    { id: 3, nombre: "Nueces", estado: false },
    { id: 4, nombre: "Crema Batida", estado: true },
    { id: 5, nombre: "Galletas Trituradas", estado: true },
  ])
  const [nuevoTopping, setNuevoTopping] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleEstado = (id: number) => {
    setToppings(toppings.map((topping) => (topping.id === id ? { ...topping, estado: !topping.estado } : topping)))
    toast({
      title: "Estado actualizado",
      description: "El estado del topping ha sido actualizado correctamente",
    })
  }

  const handleCrearTopping = () => {
    if (!nuevoTopping.trim()) {
      toast({
        title: "Error",
        description: "El nombre del topping no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    const nuevoId = Math.max(...toppings.map((t) => t.id), 0) + 1
    setToppings([...toppings, { id: nuevoId, nombre: nuevoTopping, estado: true }])
    setNuevoTopping("")
    setOpen(false)
    toast({
      title: "Topping creado",
      description: "El topping ha sido creado correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Toppings</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Topping
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Topping</DialogTitle>
              <DialogDescription>Ingresa el nombre del nuevo topping para agregarlo al sistema.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Topping</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Chispas de Chocolate"
                  value={nuevoTopping}
                  onChange={(e) => setNuevoTopping(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleCrearTopping}>
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
            {toppings.map((topping) => (
              <TableRow key={topping.id}>
                <TableCell className="font-medium">{topping.id}</TableCell>
                <TableCell>{topping.nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={topping.estado} onCheckedChange={() => handleToggleEstado(topping.id)} />
                    <span className={topping.estado ? "text-green-600" : "text-red-600"}>
                      {topping.estado ? "Activo" : "Inactivo"}
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

