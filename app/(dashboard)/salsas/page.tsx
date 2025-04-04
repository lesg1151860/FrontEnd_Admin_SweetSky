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
import type { Sauce } from "@/lib/types"
import { useRouter } from "next/navigation"

// Datos de ejemplo
const initialSauces: Sauce[] = [
  { id: 1, name: "Chocolate", active: true },
  { id: 2, name: "Fresa", active: true },
  { id: 3, name: "Caramelo", active: false },
  { id: 4, name: "Arequipe", active: true },
]

export default function SalsasPage() {
  const router = useRouter()
  const [sauces, setSauces] = useState<Sauce[]>(initialSauces)
  const [newSauce, setNewSauce] = useState({ name: "" })
  const [open, setOpen] = useState(false)

  const handleToggleActive = (id: number) => {
    setSauces(sauces.map((sauce) => (sauce.id === id ? { ...sauce, active: !sauce.active } : sauce)))
  }

  const handleAddSauce = () => {
    if (newSauce.name.trim()) {
      const newId = sauces.length > 0 ? Math.max(...sauces.map((s) => s.id)) + 1 : 1
      setSauces([...sauces, { id: newId, name: newSauce.name, active: true }])
      setNewSauce({ name: "" })
      setOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Salsas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Salsa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Salsa</DialogTitle>
              <DialogDescription>Ingrese el nombre de la nueva salsa.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={newSauce.name} onChange={(e) => setNewSauce({ name: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleAddSauce}>
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
            {sauces.map((sauce) => (
              <TableRow key={sauce.id}>
                <TableCell className="font-medium">{sauce.id}</TableCell>
                <TableCell>{sauce.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={sauce.active} onCheckedChange={() => handleToggleActive(sauce.id)} />
                    <span>{sauce.active ? "Activo" : "Inactivo"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/salsas/${sauce.id}`)}>
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

