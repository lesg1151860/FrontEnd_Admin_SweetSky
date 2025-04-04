"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileTextIcon, DownloadIcon, AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ReportFilter } from "@/lib/types"

export default function ReportesPage() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0-indexed (0 = Enero)
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1 // Mes anterior
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear // Año del mes anterior

  // Inicializar con el último mes completado
  const [filter, setFilter] = useState<ReportFilter>({
    year: lastMonthYear,
    month: lastMonth,
  })

  // Para reportes mensuales: año actual y año anterior
  const monthlyReportYears = [currentYear, currentYear - 1]

  // Para reportes anuales: solo años completados (año actual - 1 y anteriores)
  const annualReportYears = [currentYear - 1, currentYear - 2, currentYear - 3]

  // Todos los meses
  const allMonths = [
    { value: 0, label: "Enero" },
    { value: 1, label: "Febrero" },
    { value: 2, label: "Marzo" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Mayo" },
    { value: 5, label: "Junio" },
    { value: 6, label: "Julio" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Septiembre" },
    { value: 9, label: "Octubre" },
    { value: 10, label: "Noviembre" },
    { value: 11, label: "Diciembre" },
  ]

  // Meses disponibles para reportes mensuales
  const availableMonths = allMonths.filter((month) => {
    // Si es el año actual, solo mostrar meses completados (anteriores al mes actual)
    if (filter.year === currentYear) {
      return month.value < currentMonth
    }
    // Para años anteriores, mostrar todos los meses
    return true
  })

  const handleMonthlyYearChange = (year: string) => {
    const newYear = Number.parseInt(year)
    setFilter({
      ...filter,
      year: newYear,
      // Si cambiamos al año actual, asegurarse de que el mes sea válido
      month: newYear === currentYear && filter.month >= currentMonth ? lastMonth : filter.month,
    })
  }

  const handleMonthChange = (month: string) => {
    setFilter({
      ...filter,
      month: Number.parseInt(month),
    })
  }

  const handleAnnualYearChange = (year: string) => {
    setFilter({
      ...filter,
      year: Number.parseInt(year),
      month: undefined, // Quitar el mes para reportes anuales
    })
  }

  const handleGenerateMonthlyReport = () => {
    if (filter.month === undefined) {
      alert("Por favor seleccione un mes")
      return
    }

    const monthName = allMonths.find((m) => m.value === filter.month)?.label
    alert(`Generando reporte mensual para ${monthName} ${filter.year}...`)
  }

  const handleGenerateAnnualReport = () => {
    alert(`Generando reporte anual para ${filter.year}...`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Reportes</h1>
        <p className="text-muted-foreground">Genere reportes financieros mensuales o anuales.</p>
      </div>

      <Alert className="bg-secondary/20 border-secondary">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          Solo puede generar reportes de periodos completados. El reporte del mes actual estará disponible el primer día
          del mes siguiente.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5" />
              Reporte Mensual
            </CardTitle>
            <CardDescription>Genere un reporte detallado del último mes completado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Año</label>
              <Select value={filter.year.toString()} onValueChange={handleMonthlyYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el año" />
                </SelectTrigger>
                <SelectContent>
                  {monthlyReportYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mes</label>
              <Select value={filter.month?.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el mes" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-sweetBrown hover:bg-sweetBrown/80 text-white"
              onClick={handleGenerateMonthlyReport}
              disabled={filter.month === undefined}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Generar Reporte Mensual
            </Button>

            {filter.year === currentYear && (
              <p className="text-xs text-muted-foreground">
                Último mes disponible: {allMonths[lastMonth].label} {lastMonthYear}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5" />
              Reporte Anual
            </CardTitle>
            <CardDescription>Genere un reporte completo de un año culminado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Año</label>
              <Select value={filter.year.toString()} onValueChange={handleAnnualYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el año" />
                </SelectTrigger>
                <SelectContent>
                  {annualReportYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-sweetBrown hover:bg-sweetBrown/80 text-white mt-8"
              onClick={handleGenerateAnnualReport}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Generar Reporte Anual
            </Button>

            <p className="text-xs text-muted-foreground">
              El reporte del año {currentYear} estará disponible a partir del 1 de enero de {currentYear + 1}.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-secondary/20 p-4 rounded-md">
        <h3 className="font-medium mb-2">Reportes recientes</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center">
              <FileTextIcon className="h-5 w-5 mr-2 text-primary" />
              <span>Reporte Marzo {currentYear}</span>
            </div>
            <Button variant="ghost" size="sm">
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only">Descargar</span>
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center">
              <FileTextIcon className="h-5 w-5 mr-2 text-primary" />
              <span>Reporte Febrero {currentYear}</span>
            </div>
            <Button variant="ghost" size="sm">
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only">Descargar</span>
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center">
              <FileTextIcon className="h-5 w-5 mr-2 text-primary" />
              <span>Reporte Anual {currentYear - 1}</span>
            </div>
            <Button variant="ghost" size="sm">
              <DownloadIcon className="h-4 w-4" />
              <span className="sr-only">Descargar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

