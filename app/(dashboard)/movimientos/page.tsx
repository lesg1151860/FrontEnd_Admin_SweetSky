"use client"

import type React from "react"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon } from "lucide-react"
import type { Movement, MovementType } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  const handleAddMovement = () => {
    if (newMovement.type && newMovement.amount && newMovement.description) {
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

      setNewMovement({
        type: "ingreso",
        amount: 0,
        description: "",
        date: new Date(),
      })
      setOpen(false)
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
              <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
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
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleAddMovement}>
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

