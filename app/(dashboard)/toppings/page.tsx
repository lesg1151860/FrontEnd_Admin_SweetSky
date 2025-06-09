"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import type { Topping } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const initialToppings: Topping[] = [
  { id: 1, name: "Chispas de Chocolate", active: true },
  { id: 2, name: "Nueces", active: true },
  { id: 3, name: "Fresas", active: false },
  { id: 4, name: "Coco Rallado", active: true },
]

export default function ToppingsPage() {
  const router = useRouter()
  const [toppings, setToppings] = useState<Topping[]>(initialToppings)
  const [newTopping, setNewTopping] = useState({ name: "" })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleActive = (id: number) => {
    setToppings(toppings.map((topping) => (topping.id === id ? { ...topping, active: !topping.active } : topping)))
    toast({
      title: "Estado actualizado",
      description: "El estado del topping ha sido actualizado correctamente",
    })
  }

  const handleAddTopping = () => {
    if (!newTopping.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del topping no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    const newId = toppings.length > 0 ? Math.max(...toppings.map((t) => t.id)) + 1 : 1
    setToppings([...toppings, { id: newId, name: newTopping.name, active: true }])
    setNewTopping({ name: "" })
    setOpen(false)
    toast({
      title: "Topping creado",
      description: "El topping ha sido creado correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Toppings</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Topping
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Topping</DialogTitle>
              <DialogDescription>Ingrese el nombre del nuevo topping.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={newTopping.name} onChange={(e) => setNewTopping({ name: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleAddTopping}>
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {toppings.map((topping) => (
              <TableRow key={topping.id}>
                <TableCell className="font-medium">{topping.id}</TableCell>
                <TableCell>{topping.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={topping.active} onCheckedChange={() => handleToggleActive(topping.id)} />
                    <span>{topping.active ? "Activo" : "Inactivo"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/toppings/${topping.id}`)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

