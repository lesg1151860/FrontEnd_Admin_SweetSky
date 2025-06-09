"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, FilterIcon, PencilIcon, TrashIcon } from "lucide-react"
import type { Movement, MovementType } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Asegurarse de que useToast está importado
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const initialMovements: Movement[] = [
  {
    id: "1",
    type: "ingreso",
    amount: 150000,
    description: "Venta de torta de chocolate",
    date: new Date(2025, 3, 1),
  },
  {
    id: "2",
    type: "ingreso",
    amount: 85000,
    description: "Venta de cupcakes",
    date: new Date(2025, 3, 2),
  },
  {
    id: "3",
    type: "egreso",
    amount: 45000,
    description: "Compra de insumos",
    date: new Date(2025, 3, 2),
  },
  {
    id: "4",
    type: "ingreso",
    amount: 120000,
    description: "Venta de galletas",
    date: new Date(2025, 3, 3),
  },
]

export default function MovimientosPage() {
  const [movements, setMovements] = useState<Movement[]>(initialMovements)
  const [newMovement, setNewMovement] = useState<Partial<Movement>>({
    type: "ingreso",
    amount: 0,
    description: "",
    date: new Date(),
  })
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [movementFilter, setMovementFilter] = useState<"todos" | "ingreso" | "egreso">("todos")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [movementToDelete, setMovementToDelete] = useState<string | null>(null)

  // Añadir el hook useToast
  const { toast } = useToast()

  // Filtrar movimientos según el tipo seleccionado
  const filteredMovements = useMemo(() => {
    if (movementFilter === "todos") {
      return movements
    }
    return movements.filter((m) => m.type === movementFilter)
  }, [movements, movementFilter])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMovement({
      ...newMovement,
      [name]: name === "amount" ? Number(value) : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setNewMovement({
      ...newMovement,
      type: value as MovementType,
    })
  }

  const handleAddOrUpdateMovement = () => {
    if (!newMovement.type || !newMovement.amount || !newMovement.description) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    if (editMode && currentId) {
      // Actualizar movimiento existente
      setMovements(
        movements.map((movement) =>
          movement.id === currentId
            ? {
                ...movement,
                type: newMovement.type as MovementType,
                amount: newMovement.amount as number,
                description: newMovement.description as string,
              }
            : movement,
        ),
      )
      toast({
        title: "Movimiento actualizado",
        description: "El movimiento ha sido actualizado correctamente",
      })
    } else {
      // Crear nuevo movimiento
      const newId = (movements.length + 1).toString()
      setMovements([
        ...movements,
        {
          id: newId,
          type: newMovement.type as MovementType,
          amount: newMovement.amount as number,
          description: newMovement.description as string,
          date: new Date(),
        },
      ])
      toast({
        title: "Movimiento registrado",
        description: `El ${newMovement.type === "ingreso" ? "ingreso" : "egreso"} ha sido registrado correctamente`,
      })
    }

    // Resetear el formulario y cerrar el diálogo
    setNewMovement({
      type: "ingreso",
      amount: 0,
      description: "",
      date: new Date(),
    })
    setOpen(false)
    setEditMode(false)
    setCurrentId(null)
  }

  const handleEdit = (movement: Movement) => {
    setNewMovement({
      type: movement.type,
      amount: movement.amount,
      description: movement.description,
    })
    setEditMode(true)
    setCurrentId(movement.id)
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    setMovementToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (movementToDelete) {
      setMovements(movements.filter((movement) => movement.id !== movementToDelete))
      toast({
        title: "Movimiento eliminado",
        description: "El movimiento ha sido eliminado correctamente",
      })
      setDeleteDialogOpen(false)
      setMovementToDelete(null)
    }
  }

  // Calcular el balance
  const totalIngresos = movements.filter((m) => m.type === "ingreso").reduce((sum, m) => sum + m.amount, 0)

  const totalEgresos = movements.filter((m) => m.type === "egreso").reduce((sum, m) => sum + m.amount, 0)

  const balance = totalIngresos - totalEgresos

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Movimientos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? "Editar" : "Registrar Nuevo"} Movimiento</DialogTitle>
              <DialogDescription>Complete los detalles del movimiento financiero.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Movimiento</Label>
                <Select value={newMovement.type} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="egreso">Egreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={newMovement.amount}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newMovement.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setEditMode(false)
                  setCurrentId(null)
                  setNewMovement({
                    type: "ingreso",
                    amount: 0,
                    description: "",
                    date: new Date(),
                  })
                }}
              >
                Cancelar
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleAddOrUpdateMovement}>
                {editMode ? "Actualizar" : "Registrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Añadir el componente de filtro aquí */}
      <div className="flex items-center space-x-2 bg-white p-4 rounded-md border">
        <FilterIcon className="h-5 w-5 text-sweetBrown" />
        <div className="font-medium text-sm">Filtrar por tipo:</div>
        <div className="w-64">
          <Select
            value={movementFilter}
            onValueChange={(value: "todos" | "ingreso" | "egreso") => setMovementFilter(value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los movimientos</SelectItem>
              <SelectItem value="ingreso">Ingresos</SelectItem>
              <SelectItem value="egreso">Egresos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {movementFilter !== "todos" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMovementFilter("todos")}
            className="text-xs text-muted-foreground"
          >
            Limpiar filtro
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${totalIngresos.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error">${totalEgresos.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-success" : "text-error"}`}>
              ${balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length > 0 ? (
              filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.date.toLocaleDateString()}</TableCell>
                  <TableCell>{movement.description}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        movement.type === "ingreso" ? "bg-success/20 text-success" : "bg-error/20 text-error"
                      }`}
                    >
                      {movement.type === "ingreso" ? "Ingreso" : "Egreso"}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${movement.type === "ingreso" ? "text-success" : "text-error"}`}
                  >
                    {movement.type === "ingreso" ? "+" : "-"}${movement.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(movement)}>
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(movement.id)}>
                        <TrashIcon className="h-4 w-4 text-error" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No hay movimientos {movementFilter !== "todos" ? `de tipo ${movementFilter}` : ""} para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El movimiento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMovementToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-error hover:bg-error/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
