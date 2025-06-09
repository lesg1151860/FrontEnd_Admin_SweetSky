"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CakeIcon, PackageIcon, BarChart3Icon, TagIcon } from "lucide-react"
import { BalancePieChart } from "@/components/balance-pie-chart"
import { FeaturedPromotions } from "@/components/featured-promotions"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Promotion } from "@/lib/types"
import { initialPromotions } from "../promociones/page"

// Filtrar y obtener las primeras 3 promociones activas de initialPromotions
export const activePromotions: Promotion[] = initialPromotions.filter(promotion => promotion.active).slice(0, 3);

export default function DashboardPage() {
  const router = useRouter()
  const [ingresos, setIngresos] = useState(0)
  const [egresos, setEgresos] = useState(0)

  // Simular la carga de datos financieros
  useEffect(() => {
    // En un caso real, estos datos vendrían de una API
    setIngresos(450000)
    setEgresos(180000)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración de Sweet Sky Pastelería</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <CakeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 activos, 4 inactivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presentaciones</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">20 activas, 4 inactivas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promociones</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 activas, 2 inactivas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${(ingresos - egresos).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Último mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Balance Financiero</CardTitle>
            <CardDescription>Distribución de ingresos y egresos</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <BalancePieChart ingresos={ingresos} egresos={egresos} />
            </div>
            <div className="w-full md:w-1/2 space-y-4 mt-4 md:mt-0">
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-md">
                <div className="font-medium">Ingresos</div>
                <div className="font-bold text-success">${ingresos.toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-error/10 rounded-md">
                <div className="font-medium">Egresos</div>
                <div className="font-bold text-error">${egresos.toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-md">
                <div className="font-medium">Balance</div>
                <div className="font-bold text-primary">${(ingresos - egresos).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Promociones Activas</CardTitle>
              <CardDescription>Promociones vigentes</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => router.push("/promociones")}>
              Ver todas
            </Button>
          </CardHeader>
          <CardContent>
            <FeaturedPromotions promotions={activePromotions} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
