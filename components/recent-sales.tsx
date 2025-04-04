export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Torta de Chocolate</p>
          <p className="text-sm text-muted-foreground">Venta #12345</p>
        </div>
        <div className="ml-auto font-medium text-green-500">+$45.00</div>
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Cupcakes x12</p>
          <p className="text-sm text-muted-foreground">Venta #12344</p>
        </div>
        <div className="ml-auto font-medium text-green-500">+$36.00</div>
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Pastel de Fresa</p>
          <p className="text-sm text-muted-foreground">Venta #12343</p>
        </div>
        <div className="ml-auto font-medium text-green-500">+$52.00</div>
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Galletas Decoradas</p>
          <p className="text-sm text-muted-foreground">Venta #12342</p>
        </div>
        <div className="ml-auto font-medium text-green-500">+$24.00</div>
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Compra de Insumos</p>
          <p className="text-sm text-muted-foreground">Egreso #5432</p>
        </div>
        <div className="ml-auto font-medium text-red-500">-$120.00</div>
      </div>
    </div>
  )
}

