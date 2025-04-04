"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download } from "lucide-react"

export default function ReportesPage() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0-indexed (0 = January)

  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [selectedMonth, setSelectedMonth] = useState("")
  const { toast } = useToast()

  // Generar años para el selector (año actual y 5 años anteriores)
  const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString())

  // Generar meses disponibles (solo hasta el mes actual)
  const months = [
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" },
  ]

  // Filtrar meses disponibles según el año seleccionado
  const availableMonths = months.filter((month) => {
    if (Number.parseInt(selectedYear) < currentYear) {
      return true // Mostrar todos los meses para años anteriores
    }
    return Number.parseInt(month.value) < currentMonth // Solo mostrar meses pasados para el año actual
  })

  const handleGenerateMonthlyReport = () => {
    if (!selectedMonth) {
      toast({
        title: "Error",
        description: "Debes seleccionar un mes",
        variant: "destructive",
      })
      return
    }

    // Aquí iría la lógica para generar el reporte mensual
    toast({
      title: "Reporte generado",
      description: `El reporte de ${months[Number.parseInt(selectedMonth)].label} ${selectedYear} ha sido generado correctamente`,
    })
  }

  const handleGenerateYearlyReport = () => {
    // Aquí iría la lógica para generar el reporte anual
    toast({
      title: "Reporte generado",
      description: `El reporte anual de ${selectedYear} ha sido generado correctamente`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-sweetBrown">Reportes</h1>
        <p className="text-muted-foreground">Genera reportes financieros mensuales o anuales</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reporte Mensual</CardTitle>
            <CardDescription>Genera un reporte financiero para un mes específico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Mes</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-sweetBrown hover:bg-sweetBrown/80 text-white"
              onClick={handleGenerateMonthlyReport}
            >
              <FileText className="mr-2 h-4 w-4" /> Generar Reporte Mensual
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reporte Anual</CardTitle>
            <CardDescription>Genera un reporte financiero para todo el año</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-sweetBrown hover:bg-sweetBrown/80 text-white"
              onClick={handleGenerateYearlyReport}
            >
              <Download className="mr-2 h-4 w-4" /> Generar Reporte Anual
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-medium mb-2">Reportes Recientes</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-sweetBrown" />
              <span>Reporte Marzo 2025</span>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              <span className="sr-only">Descargar</span>
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-sweetBrown" />
              <span>Reporte Febrero 2025</span>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              <span className="sr-only">Descargar</span>
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-sweetBrown" />
              <span>Reporte Anual 2024</span>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              <span className="sr-only">Descargar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

