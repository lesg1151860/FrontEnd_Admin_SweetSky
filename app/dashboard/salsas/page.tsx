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

interface Salsa {
  id: number
  nombre: string
  estado: boolean
}

export default function SalsasPage() {
  const [salsas, setSalsas] = useState<Salsa[]>([
    { id: 1, nombre: "Chocolate", estado: true },
    { id: 2, nombre: "Fresa", estado: true },
    { id: 3, nombre: "Caramelo", estado: false },
    { id: 4, nombre: "Vainilla", estado: true },
    { id: 5, nombre: "Arequipe", estado: true },
  ])
  const [nuevaSalsa, setNuevaSalsa] = useState("")
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleEstado = (id: number) => {
    setSalsas(salsas.map((salsa) => (salsa.id === id ? { ...salsa, estado: !salsa.estado } : salsa)))
    toast({
      title: "Estado actualizado",
      description: "El estado de la salsa ha sido actualizado correctamente",
    })
  }

  const handleCrearSalsa = () => {
    if (!nuevaSalsa.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la salsa no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    const nuevoId = Math.max(...salsas.map((s) => s.id), 0) + 1
    setSalsas([...salsas, { id: nuevoId, nombre: nuevaSalsa, estado: true }])
    setNuevaSalsa("")
    setOpen(false)
    toast({
      title: "Salsa creada",
      description: "La salsa ha sido creada correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Salsas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nueva Salsa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Salsa</DialogTitle>
              <DialogDescription>Ingresa el nombre de la nueva salsa para agregarla al sistema.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Salsa</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Chocolate"
                  value={nuevaSalsa}
                  onChange={(e) => setNuevaSalsa(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleCrearSalsa}>
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
            {salsas.map((salsa) => (
              <TableRow key={salsa.id}>
                <TableCell className="font-medium">{salsa.id}</TableCell>
                <TableCell>{salsa.nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={salsa.estado} onCheckedChange={() => handleToggleEstado(salsa.id)} />
                    <span className={salsa.estado ? "text-green-600" : "text-red-600"}>
                      {salsa.estado ? "Activo" : "Inactivo"}
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

