export interface User {
  id: string
  email: string
  name: string
}

export interface Product {
  id: string
  name: string
  active: boolean
}

export interface Sauce {
  id: number
  name: string
  active: boolean
}

export interface Topping {
  id: number
  name: string
  active: boolean
}

export interface Presentation {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  description: string
  imageUrl: string
  active: boolean
}

export type MovementType = "ingreso" | "egreso"

export interface Movement {
  id: string
  type: MovementType
  amount: number
  description: string
  date: Date
}

export interface ReportFilter {
  year: number
  month?: number
}

