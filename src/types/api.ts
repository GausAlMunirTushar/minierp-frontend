export type Role = 'admin' | 'manager' | 'employee'

export type Permission =
  | 'dashboard.view'
  | 'products.view'
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'sales.view'
  | 'sales.create'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  roles: Role[]
  permissions: Permission[]
}

export type ApiMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  meta?: ApiMeta
}

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: ApiMeta
}

export type ApiErrorResponse = {
  success: false
  message: string
  errors?: unknown[]
}

export type LoginResponse = {
  accessToken: string
  expiresIn: string
  user: User
}

export type Category = {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type CategoryPayload = {
  name: string
}

export type Product = {
  _id: string
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: string
  createdAt: string
  updatedAt: string
}

export type ProductPayload = {
  name: string
  sku: string
  category: string
  purchasePrice: string
  sellingPrice: string
  stockQuantity: string
  image: File | null
}

export type SaleItemInput = {
  product: string
  quantity: number
}

export type SaleItem = {
  product: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type Sale = {
  _id: string
  items: SaleItem[]
  grandTotal: number
  createdBy: string
  createdAt: string
}

export type DashboardStats = {
  totalProducts: number
  totalSales: number
  lowStockProducts: Product[]
}
