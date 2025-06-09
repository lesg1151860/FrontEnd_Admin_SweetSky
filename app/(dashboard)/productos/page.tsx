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
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const initialProducts: Product[] = [
  { id: "1", name: "Torta de Chocolate", active: true },
  { id: "2", name: "Cupcake de Vainilla", active: true },
  { id: "3", name: "Galletas de Avena", active: false },
  { id: "4", name: "Brownie", active: true },
]

export default function ProductosPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [newProduct, setNewProduct] = useState({ name: "" })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleActive = (id: string) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, active: !product.active } : product)))
    toast({
      title: "Estado actualizado",
      description: "El estado del producto ha sido actualizado correctamente",
    })
  }

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    const newId = (products.length + 1).toString()
    setProducts([...products, { id: newId, name: newProduct.name, active: true }])
    setNewProduct({ name: "" })
    setOpen(false)
    toast({
      title: "Producto creado",
      description: "El producto ha sido creado correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Productos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>Ingrese el nombre del nuevo producto.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({ name: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-sweetBrown hover:bg-sweetBrown/80 text-white" onClick={handleAddProduct}>
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
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch checked={product.active} onCheckedChange={() => handleToggleActive(product.id)} />
                    <span>{product.active ? "Activo" : "Inactivo"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/productos/${product.id}`)}>
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

