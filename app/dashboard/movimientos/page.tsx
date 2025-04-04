"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

interface Movimiento {
  id: number
  tipo: "ingreso" | "egreso"
  descripcion: string
  valor: number
  fecha: string
}

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([
    { id: 1, tipo: "ingreso", descripcion: "Venta de Torta de Chocolate", valor: 45000, fecha: "2025-04-03" },
    { id: 2, tipo: "ingreso", descripcion: "Venta de Cupcakes x12", valor: 36000, fecha: "2025-04-02" },
    { id: 3, tipo: "egreso", descripcion: "Compra de insumos", valor: 120000, fecha: "2025-04-01" },
    { id: 4, tipo: "ingreso", descripcion: "Venta de Pastel de Fresa", valor: 52000, fecha: "2025-03-31" },
    { id: 5, tipo: "egreso", descripcion: "Pago de servicios", valor: 80000, fecha: "2025-03-30" },
  ])

  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "ingreso",
    descripcion: "",
    valor: "",
  })

  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const calcularBalance = () => {
    return movimientos.reduce((total, movimiento) => {
      return movimiento.tipo === "ingreso" ? total + movimiento.valor : total - movimiento.valor
    }, 0)
  }

  const handleCrearMovimiento = () => {
    if (!nuevoMovimiento.descripcion || !nuevoMovimiento.valor) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    const nuevoId = Math.max(...movimientos.map((m) => m.id), 0) + 1
    const fechaActual = new Date().toISOString().split("T")[0]

    setMovimientos([
      {
        id: nuevoId,
        tipo: nuevoMovimiento.tipo as "ingreso" | "egreso",
        descripcion: nuevoMovimiento.descripcion,
        valor: Number.parseInt(nuevoMovimiento.valor),
        fecha: fechaActual,
      },
      ...movimientos,
    ])

    setNuevoMovimiento({
      tipo: "ingreso",
      descripcion: "",
      valor: "",
    })

    setOpen(false)
    toast({
      title: "Movimiento registrado",
      description: "El movimiento ha sido registrado correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Movimientos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
              <DialogDescription>Completa los datos para registrar un nuevo movimiento financiero.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de Movimiento</Label>
                <RadioGroup
                  value={nuevoMovimiento.tipo}
                  onValueChange={(value) => setNuevoMovimiento({ ...nuevoMovimiento, tipo: value })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ingreso" id="ingreso" />
                    <Label htmlFor="ingreso" className="text-green-600">
                      Ingreso
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="egreso" id="egreso" />
                    <Label htmlFor="egreso" className="text-red-600">
                      Egreso
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  placeholder="Ej: Venta de Torta"
                  value={nuevoMovimiento.descripcion}
                  onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, descripcion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  placeholder="Ej: 45000"
                  value={nuevoMovimiento.valor}
                  onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, valor: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleCrearMovimiento}>
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm">
        <div>
          <h2 className="text-lg font-medium">Balance Total</h2>
          <p className={`text-2xl font-bold ${calcularBalance() >= 0 ? "text-green-600" : "text-red-600"}`}>
            ${calcularBalance().toLocaleString()}
          </p>
        </div>
        <div className="flex gap-4">
          <div>
            <h3 className="text-sm font-medium text-green-600">Ingresos</h3>
            <p className="text-lg font-bold text-green-600">
              $
              {movimientos
                .filter((m) => m.tipo === "ingreso")
                .reduce((sum, m) => sum + m.valor, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-600">Egresos</h3>
            <p className="text-lg font-bold text-red-600">
              $
              {movimientos
                .filter((m) => m.tipo === "egreso")
                .reduce((sum, m) => sum + m.valor, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimientos.map((movimiento) => (
              <TableRow key={movimiento.id}>
                <TableCell className="font-medium">{movimiento.id}</TableCell>
                <TableCell>{movimiento.descripcion}</TableCell>
                <TableCell>{new Date(movimiento.fecha).toLocaleDateString()}</TableCell>
                <TableCell
                  className={`text-right font-medium ${movimiento.tipo === "ingreso" ? "text-green-600" : "text-red-600"}`}
                >
                  {movimiento.tipo === "ingreso" ? "+" : "-"}${movimiento.valor.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

